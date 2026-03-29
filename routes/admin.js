const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(isAuthenticated, isAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Manage posts
router.get('/posts', adminController.managePosts);

// Manage users
router.get('/users', adminController.manageUsers);

// Manage comments
router.get('/comments', adminController.manageComments);

module.exports = router;
