const express = require('express');
const {check} = require('express-validator');
const router = express.Router();
const {adminRegister, adminLogin, getPatients, addDoctors} = require('../controllers/adminController');

//ADMIN LOGIN ROUTE
router.post('/register', [
    check('password_hash', 'Password must be at least 8 characters long').isLength({ min: 8 })
], adminRegister);

//ADMIN LOGIN ROUTE
router.post('/login', adminLogin);

//GET PATIENT LIST
router.get('/getPatients', getPatients);

//ADD NEW DOCTOR ROUTE
router.post('/addDoctors',
    [
        check('first_name', 'First name cannot be empty').not().isEmpty(),
        check('last_name', 'Last name cannot be empty').not().isEmpty(),
        check('email', 'Please enter a valid email address').isEmail(),
        check('phone', 'Please enter a valid phone number').isMobilePhone()
    ],  addDoctors);

module.exports = router;