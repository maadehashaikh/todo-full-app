const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/index');

// Public Routes
router.post('/signup', userController.createUser); // Create a new user
router.post('/login', userController.loginUser);   // User login

// Protected Routes
router.get('/profile', authenticateToken, userController.getUserProfile); // Get logged-in user profile
router.get('/users', authenticateToken, userController.getAllUsers);      // Get all users (admin or authorized users)
router.put('/update/:id', authenticateToken, userController.updateUser);  // Update a user by ID
router.delete('/delete/:id', authenticateToken, userController.deleteUser); // Delete a user by ID

module.exports = router;
