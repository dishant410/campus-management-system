const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Middleware to ensure only admin access
router.use(auth, checkRole(['admin']));

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user (admin, faculty, or student)
router.post('/users', async (req, res) => {
    try {
        const { email, password, name, role, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            password,
            name,
            role,
            department
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { name, role, department } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.role = role || user.role;
        user.department = department || user.department;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 