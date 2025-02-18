const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const {bookAppointment, completedPatientAppointment, upcomingPatientAppointment, upcomingDoctorAppointment, rescheduleAppointmentPatient, populateAppointment, cancelAppointment, deleteAppointment} = require('../controllers/appointmentController');

// BOOK APPOINTMENT ROUTE
router.post('/bookAppointment', 
    [
        check('doctor_id', 'Doctor ID is required').not().isEmpty(),
        check('appointment_date', 'Please valid date required').isDate(),
        check('appointment_time', 'Please valid time required').isTime()
    ], bookAppointment
);

//GET PATIENT COMPLETED APPOINTMENT ROUTE
router.get('/appointmentHistory/patient', completedPatientAppointment);

//GET UPCOMING APPOINTMENT FOR PATIENT ROUTE
router.get('/upcomingAppointment/patient', upcomingPatientAppointment);

//POPULATE DOCTOR NAME ON RESCHEDULE APPOINTME FORPATIENT ROUTE
router.get('/rescheduleAppointment/patient/:appointmentId', populateAppointment);

//RESCHEDULE APPOINTMENT ROUTE
router.put('/rescheduleAppointment/patient', rescheduleAppointmentPatient);



//GET UPCOMING APPOINTMENT FOR DOCTOR ROUTE
router.get('/doctor/:doctor_id/upcoming', upcomingDoctorAppointment);

//CANCEL APPOINTMENT RFOUTE
router.put('/cancelAppointment/:appointmentId', cancelAppointment);

//DELETE APPOINTMENT ROUTE
router.delete('/deleteAppointment/:appointmentId', deleteAppointment);


module.exports = router;