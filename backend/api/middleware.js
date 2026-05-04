function requireLogin(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ success: false, message: 'Login required' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}

module.exports = { requireLogin, requireAdmin };
