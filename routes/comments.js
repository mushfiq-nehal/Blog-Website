const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middleware/auth');
const { commentValidation, validate } = require('../middleware/validation');

// Create comment
router.post('/create', isAuthenticated, commentValidation, commentController.create);

// Delete comment
router.post('/:id/delete', isAuthenticated, commentController.delete);

module.exports = router;
