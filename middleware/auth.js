const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login?error=Please login to continue');
};


const isAdmin = (req, res, next) => {
    if (req.session && req.session.userId && req.session.userRole === 'admin') {
        return next();
    }
    res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page',
        user: req.session.userId ? { id: req.session.userId, username: req.session.username, role: req.session.userRole } : null
    });
};

const isGuest = (req, res, next) => {
    if (!req.session.userId) {
        return next();
    }
    res.redirect('/');
};

const attachUser = (req, res, next) => {
    if (req.session.userId) {
        res.locals.user = {
            id: req.session.userId,
            username: req.session.username,
            email: req.session.email,
            role: req.session.userRole
        };
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isGuest,
    attachUser
};
