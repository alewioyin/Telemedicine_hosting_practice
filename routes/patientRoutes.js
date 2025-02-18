const express = require('express');
const { registerPatient, loginPatient,  logoutPatient, searchTheDashboard, getPatient, updatePatient, changePassword, uploadProfilePicture, deletePatient } = require('../controllers/patientController');
const {check} = require('express-validator');
const upload = require('../app');
/* const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); */
const router = express.Router();


// REGISTRATION ROUTE
router.post('/register',
    [
    check('first_name', 'First name cannot be empty').not().isEmpty(),
    check('last_name', 'Last name cannot be empty').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    check('phone', 'Please enter a valid phone number').isMobilePhone()
    ], 
    registerPatient
);

 //LOGIN ROUTE
router.post('/login', loginPatient);

//LOGOUT ROUTE
router.get('/logout', logoutPatient);

//SEARCH DASHBOARD ROUTE
router.get('/searchDashboard', searchTheDashboard)

//GET PATIENT ROUTE
router.get('/individual', getPatient);

//EDIT PATIENT ROUTE
router.put('/individual/update', 
    [
        check('first_name', 'First name cannot be empty').not().isEmpty(),
        check('last_name', 'Last name cannot be empty').not().isEmpty(),
        check('phone', 'Please enter a valid phone number').isMobilePhone()
    ],
    updatePatient
); 

//CHANGE PASSWORD ROUTE
router.put('/individual/changePassword', [
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], changePassword); 

//UPLOAD PROFILE PICTURE ROUTE
router.post('/uploadProfilePicture', upload.single('profile_picture'),uploadProfilePicture);

router.delete('/delete', deletePatient);

module.exports = router;