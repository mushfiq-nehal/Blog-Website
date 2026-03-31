// Basic validation middleware
const validate = (req, res, next) => {
    const errors = [];

    // Check for validation errors in req.validationErrors
    if (req.validationErrors && req.validationErrors.length > 0) {
        return res.status(400).json({ errors: req.validationErrors });
    }

    next();
};

// Registration validation
const validateRegistration = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    const errors = [];

    // Username validation
    if (!username || username.length < 3 || username.length > 50) {
        errors.push('Username must be between 3 and 50 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Email validation
    if (!email || !email.includes('@')) {
        errors.push('Please provide a valid email');
    }

    // Password validation
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    // Confirm password
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        return res.render('auth/register', {
            title: 'Register',
            error: errors.join(', ')
        });
    }

    next();
};

// Login validation
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username) {
        errors.push('Username is required');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.render('auth/login', {
            title: 'Login',
            error: errors.join(', ')
        });
    }

    next();
};

// Post validation
const validatePost = (req, res, next) => {
    const { title, content } = req.body;
    const errors = [];

    if (!title || title.length < 3 || title.length > 255) {
        errors.push('Title must be between 3 and 255 characters');
    }

    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters long');
    }

    if (errors.length > 0) {
        return res.render('posts/create', {
            title: 'Create Post',
            error: errors.join(', '),
            post: { title, content }
        });
    }

    next();
};

// Comment validation
const validateComment = (req, res, next) => {
    const { content } = req.body;
    const errors = [];

    if (!content || content.length < 1 || content.length > 1000) {
        errors.push('Comment must be between 1 and 1000 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    next();
};

// Basic HTML sanitization
const sanitizeHtml = (html) => {
    if (!html) return '';
    // Simple sanitization - replace potential dangerous tags
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
};

module.exports = {
    validate,
    validateRegistration,
    validateLogin,
    validatePost,
    validateComment,
    sanitizeHtml
};
