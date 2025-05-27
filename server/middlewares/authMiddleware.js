const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return res.json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
