// Shared Express middleware for route protection.
// Import and apply these instead of duplicating the checks in every API file.

// Rejects unauthenticated requests.
// Returns 401 so the client can distinguish "not logged in" from "forbidden".
function requireLogin(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ success: false, message: 'Login required' });
    }
    next();
}

// Rejects non-admin requests.
// Returns 403 (authenticated but not authorised) so the client knows the session is valid.
function requireAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
}

module.exports = { requireLogin, requireAdmin };
