const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');



exports.registerDoctor = async (req, res) => {
    const errors = validationResult(req);

    //check if any error is present in validation
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    }

    const { email, password } = req.body;

    //fetch input parameter
    try {
        const [doctor] = await db.execute('SELECT email, password FROM doctors WHERE email = ?', [email]);

        //if doctor does not exist
        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Doctor not found. Please contact the admin.'});
        }

        //check if password has been set already
        if (doctor[0].password) {
            return res.status(400).json({ message: 'Password has already been set.'});
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('UPDATE doctors SET password = ? WHERE email = ?', 
            [ hashedPassword, email]      
        )

        //response
        res.status(200).json({ message: 'Doctor registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering doctor', error: error.message });
    }
    
}

//LOGIN DOCTOR
exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
        
        if (doctor.length === 0) {
            return res.status(401).json({ message: 'Doctor not found'});
        }
        
        const isMatch = await bcrypt.compare(password, doctor[0].password);
        
        if (!isMatch) return res.status(400).json({ message: 'Invalid email/password combinations.' });
        
        //create session
        req.session.doctorId = doctor[0].id;
        req.session.first_name = doctor[0].first_name;
        req.session.email = doctor[0].email;
        
        return res.status(200).json({ message: 'Login successful', first_name: doctor[0].first_name });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occured during login', error: error.message});
    }
};

//SHOW AVAILABLE DOCTOR
exports.getAvailableDoctors = async (req, res) => {
    const patientId = req.session.patientId;

    if (!patientId) {
        return res.status(402).json({ message: "Unauthorized: Please log in" });
    }

    try {
        const [availableDoctors] = await db.execute(`SELECT id, first_name, last_name, specialization, email, schedule
        FROM doctors  WHERE status = 'available'`, [patientId]);
            
        // if no available doctors
        if (availableDoctors.length === 0) {
                return res.status(404).json({ message: 'No doctors available at the moment.' });
        }

        return res.status(200).json(availableDoctors);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching available doctors', error: error.message });
    }
    
}

//POPULATE SPECIFIC DOCTOR FORM
exports.populateSpecificDoctor = async (req, res) => {
    const {doctorId} = req.params;
    try {
        const [populateSpecificDoctornames] = await db.execute(`SELECT id,first_name, last_name FROM doctors WHERE id = ?`, [doctorId ])

        return res.status(200).json(populateSpecificDoctornames[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching available doctors names', error: error.message });
    }
    
}

//SEARCH DOCTORS BY NAME, EMAIL AND SPECIALITY
exports.searchDoctors = async (req, res) => {
    const {searchDoctor} = req.query;
    const patientId = req.session.patientId;

    if (!patientId) {
        return res.status(402).json({ message: "Unauthorized: Please log in" });
    }

    if (!searchDoctor) {
        return res.status(403).json({ message: "Please provide a search query." });
    }

    try {
        const [searchDoctors] = await db.execute(`SELECT id, first_name, last_name, specialization, schedule FROM doctors WHERE 
            CONCAT(first_name, ' ', last_name) LIKE ?
            OR email LIKE ? 
            OR specialization LIKE ?`, [
                `%${searchDoctor}%`, `%${searchDoctor}%`, `%${searchDoctor}%`
            ]);

            if (searchDoctors.length === 0) {
                return res.status(400).json({ message: "No results found." });
            }

            return res.status(200).json(searchDoctors);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Search failed, please try again', error: error.message});
    }
} 

//GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
    try {
        const [doctors] = await db.execute(`SELECT * FROM doctors`);

        return res.status(200).json(doctors)
       
    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'An error occurred while fetching doctor', error: error.message });
    }
};

//ADD DOCTOR
exports.addDoctor = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    }

    const { first_name, last_name, specialization, email, phone, schedule } = req.body;

    try {
        // check if doctor exist
        const [doctor] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);

        if (doctor.length > 0) {
            return res.status(400).json({ message: 'Doctor already exist'});
        }

        //if doctor does not  exist
         await db.execute( ' INSERT doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)', [ first_name, last_name, specialization, email, phone, schedule ]);

        return res.status(200).json({ message: 'Doctor added successfully!'});

    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'An error occurred while adding the doctor', error: error.message });
    }
};

// GET A DOCTOR
exports.getDoctor = async (req, res) => { 
    try {
        const  email  = req.params.email;

        const [doctor] = await db.execute(`SELECT * FROM doctors WHERE email = ?`, [email]);

        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Doctor not found'});
        }
        
        return res.status(200).json(doctor[0]);      
    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'An error occurred while fetching doctor', error: error.message });
    }
};

//UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {
    const errors = validationResult(req);

    const doctorId = req.params.id;
    const { first_name, last_name, specialization, email, phone, schedule} = req.body;

    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'All fields are required', errors: errors.array() });
    }

    if (!first_name || !last_name || !specialization || !email || !phone || !schedule) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
    
    try {
        await db.execute('UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ?  WHERE id = ?', [first_name, last_name, specialization, email, phone, schedule, doctorId]);

        return res.status(200).json({ message: 'Doctor updated successfully!'});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating doctor', error: error.message });
    }
}

//DELETE DOCTOR
exports.deleteDoctor = async (req, res) => {
    
    try {
        const  doctorId  = req.params.id;

        const [doctor] = await db.execute(`DELETE FROM doctors WHERE id = ?`, [doctorId]);

        if (doctor.length === 0) {
            return res.status(400).json({ message: 'Doctor not found or deleted already'});
        }
        
        return res.status(200).json({ message: 'Doctor deleted successfully',doctorId: doctorId[0]}); 
       
    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'An error occurred while deleting the doctor', error: error.message });
    }
}