module.exports = {
    secret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_production',
    expiresIn: '7d',
    algorithm: 'HS256'
};
