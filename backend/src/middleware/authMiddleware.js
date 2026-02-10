const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { ApiError } = require('../utils/errors');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return next(new ApiError(401, 'Access denied. No token provided.'));
    }

    jwt.verify(token, jwtConfig.secret, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new ApiError(401, 'Token expired'));
            }
            return next(new ApiError(403, 'Invalid token'));
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
