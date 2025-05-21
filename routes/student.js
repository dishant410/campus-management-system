const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Middleware to ensure only student access
router.use(auth, checkRole(['student']));

// Get student profile
router.get('/profile', async (req, res) => {
    try {
        const student = await User.findById(req.user._id, '-password');
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update student profile
router.put('/profile', async (req, res) => {
    try {
        const { name } = req.body;
        const student = await User.findById(req.user._id);

        if (name) student.name = name;

        await student.save();
        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get faculty in department
router.get('/faculty', async (req, res) => {
    try {
        const faculty = await User.find(
            { 
                role: 'faculty',
                department: req.user.department 
            },
            '-password'
        );
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 