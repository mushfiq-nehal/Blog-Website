const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middleware/auth');
const { validateLogin, validateRegistration } = require('../middleware/validation');

// Show login page
router.get('/login', isGuest, authController.showLogin);

// Handle login
router.post('/login', isGuest, validateLogin, authController.login);

// Show register page
router.get('/register', isGuest, authController.showRegister);

// Handle registration
router.post('/register', isGuest, validateRegistration, authController.register);

// Handle logout
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

module.exports = router;
