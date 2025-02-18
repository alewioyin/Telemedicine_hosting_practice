const db = require('../config/database');
const {validationResult} = require('express-validator');
const { createNotification } = require('./notificationController');

//FUNCTION FOR BOOK APPOINTMENT
exports.bookAppointment = async (req, res) => {
    const errors = validationResult(req);
    const patientId = req.session.patientId;

    //check if any error is present in validation
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    };

    //fetch input parameter
    const { doctor_id, appointment_date, appointment_time, status} = req.body;

    // Check if patient is logged in
    if (!patientId) {
        return res.status(402).json({ message: "Unauthorized: Please log in" });
    }

    const schedule = await db.execute(`SELECT * FROM doctors WHERE id =?`, [doctor_id]);
    
    // check if doctor is available on selected date and time
    if (schedule[0].length === 0) {
        return res.status(400).json({ message: 'Doctor not found'});
    }
    
    const [slot] = await db.execute(`SELECT * FROM appointments WHERE doctor_id =? AND appointment_date =? AND appointment_time =?`, [doctor_id, appointment_date, appointment_time]);
    
    // check if slot is already booked
    if (slot.length > 0) {
        return res.status(400).json({ message: 'Slot already booked. Please select another slot'})
    };

    // if slot is available then book appointment
    // update appointment status to 'pending'
    await db.execute('UPDATE appointments SET status =? WHERE doctor_id =? AND appointment_date =? AND appointment_time =?', ['scheduled', doctor_id, appointment_date, appointment_time]);

   
    try {
        //IF SLOT IS NOT BOOKED THEN INSERT RECORD
        const result = await db.execute(
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",[patientId, doctor_id, appointment_date, appointment_time, status]
        );

        createNotification(patientId, `Appointment booked successfully with Dr ${schedule[0][0].first_name} ${schedule[0][0].last_name} on ${appointment_date} at ${appointment_time}`);

        return res.status(200).json({ message: "Appointment booked successfully", appointmentId: result.insertId});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error booking appointment', error: error.message });
    }
};
// FUNCTION TO GET COMPLETED AND CANCELLED APPOINTMENTS FOR PATIENT
exports.completedPatientAppointment = async (req, res) => {
    const patientId = req.session.patientId;

    // Check if patient is logged in
    if (!patientId) {
        return res.status(402).json({ message: "Unauthorized: Please log in" });
    };
    
    try {
        const [appointments] = await db.execute(`SELECT 
            a.id,
            a.appointment_date,
            a.appointment_time, 
            a.status, 
            d.first_name, 
            d.last_name
             FROM 
                appointments AS a
            INNER JOIN 
                doctors AS d 
            ON 
                a.doctor_id = d.id
            WHERE 
                a.patient_id = ? AND a.status IN ('completed', 'canceled')
            ORDER BY 
                a.appointment_date DESC`, 
            [patientId])

        if (appointments.length === 0) {
            return res.status(400).json({ message: 'No appointments history yet'});
        }

        return res.status(200).json(appointments)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching appointments', error: error.message });
    }
};

// FUNCTION TO GET UPCOMING APPOINTMENT FOR PATIENT
exports.upcomingPatientAppointment = async (req, res) => {
    const patientId = req.session.patientId;

      // Check if patient is logged in
      if (!patientId) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    try {
        const [upcomingAppointment] = await db.execute(`  
            SELECT 
                appointments.id AS appointmentId,
                CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctorName,
                appointments.appointment_date AS appointmentDate,
                appointments.appointment_time AS appointmentTime
            FROM 
                appointments
            JOIN 
                doctors ON appointments.doctor_id = doctors.id
            WHERE 
                appointments.patient_id = ? AND appointments.status = 'Scheduled'
            ORDER BY 
                appointments.appointment_date ASC`, [patientId])

            if (upcomingAppointment.length === 0) {
                return res.status(400).json({ message: 'No upcoming appointments yet'});
            }

            return res.status(200).json(upcomingAppointment);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching upcoming appointments', error: error.message });
    }


}

//POPULATE APPOINTMENT
exports.populateAppointment = async (req, res) => {
    const {appointmentId} = req.params;
    const patientId = req.session.patientId;

    if (!patientId) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
    }

    try {
        const [populateAppointment] = await db.execute (`
            SELECT 
                appointments.id AS appointment_id,
                CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctorName,
                appointments.appointment_date AS appointmentDate,
                appointments.appointment_time AS appointmentTime,
                appointments.status AS appointmentStatus
            FROM
                appointments
            JOIN
                doctors ON appointments.doctor_id = doctors.id
            WHERE
                appointments.id = ? AND appointments.patient_id = ?
            `, [appointmentId, patientId]);

        if (populateAppointment.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        return res.status(200).json(populateAppointment[0]);
        
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ message: 'Failed to fetch doctor names', error: error.message });
    }
}

// FUNCTION TO RESCHEDULE APPOINTMENT FOR PATIENT
exports.rescheduleAppointmentPatient = async (req, res) => {
    const { appointmentId, appointmentDate, appointmentTime } = req.body;
    const patientId = req.session.patientId;

    //check if the patient is logged in or authorised
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized!. Please log in.'});
    } 

    try {
        // Fetch the current appointment details
        const [currentAppointment] = await db.execute(`
            SELECT 
                appointments.appointment_date,
                appointments.appointment_time,
                doctors.first_name,
                doctors.last_name
            FROM 
                appointments
            JOIN 
                doctors ON appointments.doctor_id = doctors.id
            WHERE 
                appointments.id = ? AND appointments.patient_id = ?`, [appointmentId, patientId]);

        if (currentAppointment.length === 0) {
            return res.status(400).json({ message: 'Appointment not found or already completed/canceled' });
        }

        // Update the appointment with new date and time
        await db.execute(`
            UPDATE 
                appointments 
            SET
                appointment_date = ?,
                appointment_time = ? 
            WHERE
                id = ? AND patient_id = ?`, [appointmentDate, appointmentTime, appointmentId, patientId]);

        const doctorName = `${currentAppointment[0].first_name} ${currentAppointment[0].last_name}`;

        createNotification(patientId, `Your appointment rescheduled successfully with Dr ${doctorName} from ${new Date (currentAppointment[0].appointment_date).toDateString()} at ${currentAppointment[0].appointment_time} to ${new Date (appointmentDate).toDateString()} at ${appointmentTime}`);

        return res.status(200).json({ message: 'Appointment successfully rescheduled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while rescheduling the appointment', error: error.message });
    }
};

// FUNCTION TO GET UPCOMING APPOINTMENT FOR DOCTOR
exports.upcomingDoctorAppointment = async (req, res) => {
    const {doctor_id} = req.params;

    try {
        const [appointments] = await db.execute('SELECT id, appointment_date, appointment_time, status FROM appointments WHERE doctor_id = ? AND status = "scheduled"', [doctor_id]);

        if (appointments.length === 0) {
            return res.status(400).json({ message: 'No upcoming appointments found'});
        }

        return res.status(200).json(appointments)

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching appointments', error: error.message });
    }
};

//FUNCTION  TO CANCEL APPOINTMENT
exports.cancelAppointment = async (req, res) => {
    const {appointmentId} = req.params;
    const patientId = req.session.patientId;

    //check if the patient is logged in or authorised
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized!. Please log in.'});
    }

    try {
        const [appointment] = await db.execute(`
            SELECT 
                appointments.id,
                appointments.appointment_date,
                appointments.appointment_time,
                doctors.first_name,
                doctors.last_name
            FROM 
                appointments
            JOIN 
                doctors ON appointments.doctor_id = doctors.id
            WHERE 
                appointments.id = ? AND appointments.patient_id = ?`, [appointmentId, patientId]);

        if (appointment.length === 0) {
            return res.status(400).json({ message: 'Appointment not found or already completed/canceled' });
        }

        await db.execute('UPDATE appointments SET status = "canceled" WHERE id = ? AND patient_id = ?', [appointmentId, patientId]);

        createNotification(patientId, `Your appointment with Dr ${appointment[0].first_name} ${appointment[0].last_name} on ${new Date (appointment[0].appointment_date).toDateString()} at ${appointment[0].appointment_time} has been canceled`);

        return res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while cancelling appointments', error: error.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const patientId = req.session.patientId;

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized!. Please log in.'});
    }

    try {
         // Notify the patient about the deleted appointment.
         const [deleteAppointment] = await db.execute(`
            SELECT 
                appointments.id,
                appointments.appointment_date,
                appointments.appointment_time,
                doctors.first_name,
                doctors.last_name
            FROM 
                appointments
            JOIN 
                doctors ON appointments.doctor_id = doctors.id
            WHERE 
                appointments.id = ?`, [appointmentId]);

            if (deleteAppointment.length === 0) {
                return res.status(400).json({message: 'No appointments to be deleted.'})
            }

        await db.execute(`
            DELETE FROM appointments WHERE id = ? AND patient_id = ?
            `, [appointmentId, patientId])

            

       

            const doctorName = `${deleteAppointment[0].first_name} ${deleteAppointment[0].last_name}`;

            createNotification(patientId, `Your appointment with Dr ${doctorName} on ${new Date (deleteAppointment[0].appointment_date).toDateString()} at ${deleteAppointment[0].appointment_time} has been deleted.`);

            return res.status(200).json({ message: 'Appointments deleted successfully.'})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occured while deleting appointment.', error: error.message})
    }

};