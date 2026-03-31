const User = require('../models/User');

const authController = {

    showLogin: (req, res) => {
        res.render('auth/login', {
            title: 'Login',
            error: req.query.error || null
        });
    },

    
    showRegister: (req, res) => {
        res.render('auth/register', {
            title: 'Register',
            error: null
        });
    },

    
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            
            const user = await User.findByUsername(username);
            if (!user) {
                return res.render('auth/login', {
                    title: 'Login',
                    error: 'Invalid username or password'
                });
            }

            
            const isValid = await User.verifyPassword(password, user.password);
            if (!isValid) {
                return res.render('auth/login', {
                    title: 'Login',
                    error: 'Invalid username or password'
                });
            }

            
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.userRole = user.role;

            
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

    
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            
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

            
            const user = await User.create(username, email, password);

            
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
