const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: Session Token Missing' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        // Distinguish between expired and invalid tokens
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session Expired: Please log in again.' });
        }
        return res.status(403).json({ error: 'Invalid Token: Authentication failed.' });
    }
}

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource.' });
        }
        next();
    };
};

// Optional: use on any route to just log who is accessing it
function logAccess(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.user?.role?.toUpperCase()} #${req.user?.id} → ${req.method} ${req.path}`);
    next();
}

module.exports = { requireAuth, requireRole, logAccess };