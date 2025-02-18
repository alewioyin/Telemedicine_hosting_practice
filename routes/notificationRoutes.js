const express = require('express');
const {getPatientNotifications, markAllAsRead} = require('../controllers/notificationController');
const router = express.Router();

// GET NOTIFICATIONS FOR A PATIENT
router.get('/patientNotifications', getPatientNotifications);

//MARK NOTIFICATION AS READ
router.put('/markAllAsRead', markAllAsRead);



module.exports = router;
