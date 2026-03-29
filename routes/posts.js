const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { postValidation, validate } = require('../middleware/validation');

// Public routes
router.get('/', postController.index);
router.get('/:slug', postController.show);

// Protected routes (authenticated users can create posts)
router.get('/create/new', isAuthenticated, postController.showCreate);
router.post('/create', isAuthenticated, postValidation, postController.create);

// Edit and delete (author or admin - authorization checked in controller)
router.get('/:slug/edit', isAuthenticated, postController.showEdit);
router.post('/:slug/edit', isAuthenticated, postValidation, postController.update);
router.post('/:slug/delete', isAuthenticated, postController.delete);

module.exports = router;
