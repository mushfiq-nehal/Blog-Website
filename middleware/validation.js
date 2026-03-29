const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Store errors in session or return as JSON
        req.validationErrors = errors.array();
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Registration validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
];

// Login validation rules
const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Post validation rules
const postValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('Title must be between 3 and 255 characters'),
    body('content')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),
    body('visibility')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('Visibility must be either public or private'),
    body('meta_description')
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage('Meta description should not exceed 160 characters'),
    body('meta_keywords')
        .optional()
        .trim()
];

// Comment validation rules
const commentValidation = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters')
];

// Sanitize HTML to prevent XSS (basic)
const sanitizeHtml = (html) => {
    // Basic sanitization - in production, use a library like DOMPurify or sanitize-html
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
};

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    postValidation,
    commentValidation,
    sanitizeHtml
};
