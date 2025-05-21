const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Middleware to ensure only faculty access
router.use(auth, checkRole(['faculty']));

// Get faculty profile
router.get('/profile', async (req, res) => {
    try {
        const faculty = await User.findById(req.user._id, '-password');
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update faculty profile
router.put('/profile', async (req, res) => {
    try {
        const { name, department } = req.body;
        const faculty = await User.findById(req.user._id);

        if (name) faculty.name = name;
        if (department) faculty.department = department;

        await faculty.save();
        res.json({ message: 'Profile updated successfully', faculty });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get students in department
router.get('/students', async (req, res) => {
    try {
        const students = await User.find(
            { 
                role: 'student',
                department: req.user.department 
            },
            '-password'
        );
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 