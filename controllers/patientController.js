const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { createNotification } = require('./notificationController');

//FUNCTION FOR PATIENT REGISTER
exports.registerPatient = async (req, res) => {
    const errors = validationResult(req);
    const patientId = req.session.patientId;
    
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized, Please login to continue.'});
    }

    //check if any error is present in validation
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    }

    //fetch input parameter
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    try {
        // check if patient exist
        const [patient] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
        
        if (patient.length > 0) {
            return res.status(400).json({ message: 'The user already exist'});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //insert record
        await db.execute('INSERT INTO patients (first_name, last_name, email, password, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
            first_name,
            last_name,
            email,
            hashedPassword,
            phone,
            date_of_birth,
            gender,
            address
        ]);

        //response
        res.status(200).json({ message: 'User registered successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering User', error: error.message });
    } 
};


//FUNCTION FOR PATIENT LOGIN
exports.loginPatient = async (req, res) => {
    //fetch email & password from request body
    const { email, password } = req.body;

    try {
        const [ patient ] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);

        if (patient.length === 0) {
            return res.status(401).json({ message: 'User not found'});
        }

        //check password
        const isMatch = await bcrypt.compare(password, patient[0].password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid email/password combinations.' });

        //CHECK IF PATIENT IS ALREADY LOGGED IN
        if (req.session.patientId) {
            return res.status(400).json({ message: 'User is already logged in.'});
        }

        //create session
        req.session.patientId = patient[0].id;
        req.session.first_name = patient[0].first_name;
        req.session.email = patient[0].email;
        
        return res.status(200).json({ message: 'Login successful', first_name: patient[0].first_name, patient_id: patient[0].id});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occured during login', error: error.message})
    }
};

//FUNCTION FOR PATIENT SEARCH DASHBOARD
exports.searchTheDashboard = async (req, res) => {
    const {searchQuery} = req.query;
    const patientId = req.session.patientId;

    if (!searchQuery) {
        return res.status(400).json({ message: "No search query provided" });
    };

    //check if patient is logged in
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized!. Please log in.'});
    };

    try {
        const  [result]  =  await db.execute(`

            SELECT 
                'doctor' AS type,
                CONCAT(doctors.first_name, ' ', doctors.last_name) AS name,
                doctors.email AS detail2,
                doctors.phone AS detail3,
                doctors.specialization AS detail4
            FROM 
                doctors
            WHERE 
                CONCAT(doctors.first_name, ' ', doctors.last_name) LIKE ? 
                OR doctors.email LIKE ?
                OR doctors.phone LIKE ?
                OR doctors.specialization LIKE ?

            UNION ALL

            SELECT 
                'appointment' AS type,
                CONCAT(doctors.first_name, ' ', doctors.last_name) AS doctorName,
                appointments.appointment_date AS appointment_date,
                appointments.appointment_time AS appointment_time,
                appointments.status AS status
            FROM 
                appointments
            JOIN 
                doctors ON appointments.doctor_id = doctors.id
            WHERE 
                appointments.patient_id = ? 
                AND (
                    CONCAT(doctors.first_name, ' ', doctors.last_name) LIKE ? 
                    OR  appointments.appointment_date LIKE ?
                    OR appointments.appointment_time LIKE ?
                    OR appointments.status LIKE ? 
                );
        `, [ `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`,
            patientId, 
            `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]);
    

            if (result.length === 0) {
                return res.status(402).json({ message: 'No results found'})
            }

            return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Search failed, please try again', error: error.message});
    } 
};

//FUNCTION TO GET PATIENT TO EDIT INFORMATION
exports.getPatient = async (req, res) => {
    const patientId = req.session.patientId;

    //check if the patient is logged in or authorised
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized!. Please log in.'});
    } 

    try {
        //fetch patient,
        const [patient] = await db.execute('SELECT first_name, last_name, email, phone, date_of_birth, gender, address, profile_picture FROM patients WHERE id = ?', [patientId 
        ]);

        if (patient.length === 0) {
            return res.status(400).json({ message: 'User not found'})
        }

        return res.status(200).json({
            first_name: patient[0].first_name,
            last_name: patient[0].last_name,
            email: patient[0].email,
            phone: patient[0].phone,
            date_of_birth: patient[0].date_of_birth,
            gender: patient[0].gender,
            address: patient[0].address,
            profile_picture: `data:image/jpeg;base64,${patient[0].profile_picture}`,
            patient_id: patientId,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occured while fetching User details.', error: error.message})
    }
};

//FUNCTION FOR PATIENT EDITING
exports.updatePatient = async(req, res) => {
    const patientId = req.session.patientId;
    
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized, Please login to continue.'});
    }

    const errors = validationResult(req);

    //check if any errors present  in validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Please correct input errors', errors: errors.array() })
    }

    //fetch patient details from requst body
    const { first_name, last_name, phone, date_of_birth, gender, address} = req.body;

    try {
        //update user details
        await db.execute('UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
      [first_name, last_name, phone, date_of_birth, gender, address, patientId]);

      //create notification when patient update details
        await createNotification(patientId, 'Your profile information have been updated.');

      return res.status(200).json({ message: 'Details updated successfully.'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occured during edit.', error: error.message})
    }

};

//FUNCTION FOR PATIENT TO CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const patientId = req.session.patientId; // Assume patient_id is in session.

    // Check if the user is authenticated.
    if (!patientId) {
        return res.status(401).json({ message: 'Unauthorized! Please log in.' });
    }

    try {
        // Retrieve the stored hashed password.
        const [password] = await db.execute(`SELECT password FROM patients WHERE id = ?`, [patientId]);
        if (password.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const storedPasswordHash = password[0].password;

        // Verify current password.
        const isMatch = await bcrypt.compare(currentPassword, storedPasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        // Hash the new password and update it in the database.
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute(`UPDATE patients SET password = ? WHERE id = ?`, [hashedPassword, patientId]);

        await createNotification(patientId, 'Your password has been changed.');
        return res.status(200).json({ message: 'Password successfully changed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while changing the password.', error: error.message });
    }
};


//FUNCTION FOR PATIENT TO UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
    const patientId = req.session.patientId;

    if (!patientId) {
        return res.status(401).json({ message: 'Unauthirized, Please log in.'});
    };

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a valid image file.' });
    }

    try { 
        const profilePictureBase64 = req.file.buffer.toString('base64');

        await db.execute('UPDATE patients SET profile_picture = ? WHERE id = ?', [profilePictureBase64, patientId]);

        await createNotification(patientId, 'Your profile picture has been updated.');

        return res.status(200).json({ message: 'Profile picture uploaded successfully.', profile_picture: `data:${req.file.mimetype};base64,${profilePictureBase64}`,});
    } catch (error) {
        console.error('Error uploading picture:', error);
        return res.status(500).json({ message: 'Failed to upload profile picture.', error: error.message});
    }
}

//FUNCTION FOR PATIENT LOGOUT
exports.logoutPatient = async (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Logout failed', error: err.message});
        }
        return res.status(200).json({ message: 'User successfully logged out.'});
    })
};

//FUNCTION FOR PATINT TO DELETE ACCOUNT
exports.deletePatient = async(req, res) => {
    const patientId = req.session.patientId;
     // Check if patient exists
     if (!patientId) {
        return res.status(401).json({ message: 'You must be logged in to delete your account.'});
    }

    try {
        //fetch patient
        const [patient] = await db.execute('DELETE FROM patients WHERE id = ?', [patientId]);

        if (patient.length === 0) {
            return res.status(400).json({ message: 'User not found or already deleted'})
        }

        return res.status(200).json({ message: 'Account deleted successfully.', patient: patient[0]});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occured while deleting patient details.', error: error.message})
    }
};