const jwt = require('jsonwebtoken');
require('dotenv').config();

// Token verification
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token || token === undefined) {
            return res.status(401).json({ message: 'JWT token is required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ status: 401, message: "Token expired! Please log in again." });
                }
                return res.status(403).json({ status: 403, message: "Invalid token." })
            }

            const { id, role } = decoded;
            if (!role === 'organization') {
                return res.status(403).json({ status: 403, message: "Unauthorized! Invalid role." });
            }
            req.user = { id, role };

            next();
        });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message });
    }
};

module.exports = {
    verifyToken
};