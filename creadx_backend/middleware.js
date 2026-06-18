const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: Session Token Missing' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Injects { id, role } into the request cycle
        next();
    } catch (err) {
        res.status(403).json({ error: 'Session Expired or Invalid Signature Token' });
    }
}

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Restricted access constraints block this view.' });
        }
        next();
    };
};

module.exports = { requireAuth, requireRole };