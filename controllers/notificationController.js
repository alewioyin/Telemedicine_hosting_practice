const db = require('../config/database');

let io;

exports.initializeSocket = (socketIo) => {
    io = socketIo;
};
//CREATE CONNECTION
exports.createNotification = async (patientId, message) => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    };

    try {
        const [result ] = await db.query('INSERT INTO notifications (patient_id, message, is_read) VALUES (?, ?, ?)', [patientId, message, false]);

        io.to(patientId.toString()).emit("newNotification", message);
        return result.insertId;
        
    } catch (error) {
        console.log("Error creating notification:", error);
    }
};

//FETCH NOTIFICATION
exports.getPatientNotifications = async (req, res) => {
    try {
        const patientId = req.session.patientId;
        const [notifications] = await db.execute('SELECT * FROM notifications WHERE patient_id = ? AND is_read = 0 ORDER BY created_at DESC', [patientId]);
        return res.status(200).json(notifications);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving notifications" });
    }
};

//MARK NOTIFICATION AS READ
 exports.markAllAsRead = async (req, res) => {
    try {
        const patientId = req.session.patientId;

       /*  const {id} = req.params; */
        await db.execute('UPDATE notifications SET is_read = 1 WHERE patient_id = ? AND is_read = 0', [patientId]);
        return res.status(200).json({success: true, message: 'Notification marked as read'});


       
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating notification" });
    }
};

