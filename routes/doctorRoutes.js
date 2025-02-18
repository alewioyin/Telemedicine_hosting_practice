const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const { registerDoctor, loginDoctor, getAvailableDoctors, populateSpecificDoctor, getAllDoctors, searchDoctors, addDoctor,   getDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorsController');

// REGISTER DOCTOR ROUTE
router.post('/register', 
    [
        check('email', 'Please enter a valid email address').isEmail(),
        check('password', 'Password must be at least 8 characters long').isLength({ min: 8 })
    ],
    registerDoctor
);

// LOGIN DOCTOR ROUTE
router.post('/login', 
    [
        check('email', 'Please enter a valid email address').isEmail()
    ],
    loginDoctor
);

//SHOW AVAILABLE DOCTOR ROUTE
router.get('/getAvailableDoctors', getAvailableDoctors)

//POPULATE DOCTOR NAME ON SPECIFIC DOCTOR APPOINTMENT FORM ROUTE
router.get('/populateSpecificDoctor/:doctorId', populateSpecificDoctor);

//SHOW ALL DOCTORS ROUTE
router.get('/allDoctors', getAllDoctors);

//SEARCH DOCTORS WITH NAME, EMAIL AND SPECIALITY ROUTE
router.get('/searchDoctor',  searchDoctors);

//ADD OR SAVE NEW DOCTOR ROUTE
router.post('/addDoctor', 
    [
        check('first_name', 'First name cannot be empty').not().isEmpty(),
        check('last_name', 'Last name cannot be empty').not().isEmpty(),
        check('email', 'Please enter a valid email address').isEmail(),
        check('phone', 'Please enter a valid phone number').isMobilePhone()
    ], 
    addDoctor
);

//SHOW A DOCTOR ROUTE
router.get('/individual/:email', getDoctor);

//EDIT DOCTOR ROUTE
router.put('/:id', updateDoctor)

//DELETE DOCTOR ROUTE
router.delete('/deleteDoctor/:id', deleteDoctor);


module.exports = router;