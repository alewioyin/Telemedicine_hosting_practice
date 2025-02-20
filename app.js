const express = require('express');
const db = require('./config/database')
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const notificationController = require('./controllers/notificationController');


//SET UP ENV ENVIRONMENT
dotenv.config();

//INITIALIZE APP
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
notificationController.initializeSocket(io);

// SET UP MIDDLEWARE
app.use(express.static("index.html"));
app.use(express.static("views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  true}));

//CONFIGURE SESSION STORE
const sessionStore = new MySQLStore({}, db);

//CONFIGURE SESSION MIDDLEWARE
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: /* 1000 * 60 * 60 */ 30 * 60 * 1000,
        secure: false,
    }
}));

//RESET SESSION EXPIRATION ON ACTIVITY
app.use((req, res, next) => {
    if (req.session) {
        // Reset session expiration on activity
        req.session._garbage = Date();
        req.session.touch();
    }
    next();
});

//CHECK IF USER IS LOGGED IN
/* app.use((req, res, next) => {
    if (!req.session.patientId || !req.session.doctorId || !req.session.adminId) {
        return next();
    }
    res.redirect('/views/html/login.html');
    
    // CHECK IF USER IS ADMIN
    app.use((req, res, next) => {
        if (!req.session.adminId) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized, Please login as an admin to continue.'});
    });

    //CHECK IF USER IS PATIENT
    app.use((req, res, next) => {
        if (!req.session.patientId) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized, Please login as a patient to continue.'});
    });
    
    //CHECK IF USER IS DOCTOR
    app.use((req, res, next) => {
        if (!req.session.doctorId) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized, Please login as a doctor to continue.'});
    });

}); */

app.use((req, res, next) => {
    if (!req.session.patientId || !req.session.doctorId || !req.session.adminId) {
        return next();
    }
    res.redirect('/views/html/login.html');
});

//CONFIGURE MULTER FOR STORAGE OF PROFILE PICTURE 
    const storage = multer.memoryStorage();
    const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed!'), false);
            }
        },
    });

    app.use((req, res, next) => {
        req.upload = upload;
        next();
    });

    module.exports = upload;
    
//LANDING PAGE
    app.get('/', (req, res) =>{
        res.sendFile(path.join(__dirname, 'index.html'))
    })

//DEFINE ROUTES
    app.use('/telemedicine/api/patients', require('./routes/patientRoutes'));
    app.use('/telemedicine/api/doctors', require('./routes/doctorRoutes'));
    app.use('/telemedicine/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/telemedicine/api/admin', require('./routes/adminRoutes'));
    app.use('/telemedicine/api/notifications', require('./routes/notificationRoutes'));

//SOCKET.IO  NOTIFICATIONS
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('joinRoom', (patientId) => {
            socket.join(patientId.tostring());
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    module.exports = { app, io };


//LAUNCH SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
})