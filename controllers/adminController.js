const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

//FUNCTION FOR ADMIN REGISTRATION
exports.adminRegister = async (req, res) => {
    const errors = validationResult(req);

    //check if any error is present in validation
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    }

    //fetch input parameter
    const { username, password_hash, role } = req.body;

    try {
        // check if patient exist
        const [admin] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
        
        if (admin.length > 0) {
            return res.status(400).json({ message: 'Admin already exist'});
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password_hash, 10);

        //insert record
        await db.execute('INSERT INTO admin ( username, password_hash, role) VALUES (?, ?, ?)', [
            username,
            hashedPassword,
            role
        ]);

        //response
        res.status(200).json({ message: 'Admin registered successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};

//FUNCTION FOR ADMIN LOGIN
exports.adminLogin = async (req, res) => {
    const errors = validationResult(req);

    //check if any error is present in validation
    if (!errors.isEmpty()) {
        return res.status(401).json({ message: 'Please correct input errors', errors: errors.array() });
    }
    
    const { username, password_hash} = req.body;

    try {
        const [admin] = await db.execute(`SELECT * FROM admin WHERE username = ?`, [username]);

        if (admin.length === 0) {
            return res.status(401).json({ message: 'Admin not found'});
        }

        const isMatch = await bcrypt.compare(password_hash, admin[0].password_hash);

        if (!isMatch) return res.status(400).json({ message: 'Invalid email/password combinations.' });

        req.session.adminId = admin[0].id;
        req.session.username = admin[0].username;

        return res.status(200).json({ message: 'Login successful', username: admin[0].username});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occured during login', error: error.message});
    }
};

//function to get patients list
exports.getPatients = async (req, res) => {
    const {search, filter} = req.query;
    let query = `SELECT * FROM patients `;
    let params = [];

    if (search || filter) {
        query += ' WHERE';
        if (search) {
            query += ' (first_name LIKE ? OR last_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (filter) {
            if (search) query += ' AND';
            query += ' gender = ?';
            params.push(filter);
        }
    } 

    try {
        const [patients] = await db.execute(query, params);

        if (patients.length === 0) {
            return res.status(400).json({ message: 'Patients not found'})
        }
        return res.status(200).json({message: 'Patients list displayed', patients: patients})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching patients', error: error.message});
    }
};

//function to add new doctors
exports.addDoctors = async (req, res) => {
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
}