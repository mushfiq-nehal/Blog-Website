const User = require('../models/User');

const authController = {
    // Show login page
    showLogin: (req, res) => {
        res.render('auth/login', {
            title: 'Login',
            error: req.query.error || null
        });
    },

    // Show register page
    showRegister: (req, res) => {
        res.render('auth/register', {
            title: 'Register',
            error: null
        });
    },

    // Handle login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Find user
            const user = await User.findByUsername(username);
            if (!user) {
                return res.render('auth/login', {
                    title: 'Login',
                    error: 'Invalid username or password'
                });
            }

            // Verify password
            const isValid = await User.verifyPassword(password, user.password);
            if (!isValid) {
                return res.render('auth/login', {
                    title: 'Login',
                    error: 'Invalid username or password'
                });
            }

            // Set session
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.userRole = user.role;

            // Redirect to return URL or home
            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(returnTo);
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', {
                title: 'Login',
                error: 'An error occurred. Please try again.'
            });
        }
    },

    // Handle registration
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.render('auth/register', {
                    title: 'Register',
                    error: 'Username already exists'
                });
            }

            const existingEmail = await User.findByEmail(email);
            if (existingEmail) {
                return res.render('auth/register', {
                    title: 'Register',
                    error: 'Email already registered'
                });
            }

            // Create user
            const user = await User.create(username, email, password);

            // Auto login after registration
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.userRole = user.role;

            res.redirect('/');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('auth/register', {
                title: 'Register',
                error: 'An error occurred. Please try again.'
            });
        }
    },

    // Handle logout
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/');
        });
    }
};

module.exports = authController;
