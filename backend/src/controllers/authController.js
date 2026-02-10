const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');
const jwtConfig = require('../config/jwt');
const { ApiError } = require('../utils/errors');

// Helper to generate JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn, algorithm: jwtConfig.algorithm }
    );
};

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const { name, email, password } = req.body;

    try {
        // Check if email exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) return next(new ApiError(500, 'Database error', err.message));
            if (row) return next(new ApiError(409, 'Email already exists'));

            // Hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user
            const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
            db.run(sql, [name, email, hashedPassword], function (err) {
                if (err) return next(new ApiError(500, 'Error creating user', err.message));

                const userId = this.lastID;
                console.log(`[AUTH] New user registered: ${email} (ID: ${userId})`);

                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    user: { id: userId, name, email }
                });
            });
        });
    } catch (error) {
        next(new ApiError(500, 'Server error during registration'));
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const { email, password } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) return next(new ApiError(500, 'Database error'));
            if (!user) return next(new ApiError(401, 'Invalid email or password'));

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return next(new ApiError(401, 'Invalid email or password'));

            // Update last login
            db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            const token = generateToken(user);
            console.log(`[AUTH] User logged in: ${email}`);

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch (error) {
        next(new ApiError(500, 'Server error during login'));
    }
};

exports.verify = (req, res) => {
    // If middleware passes, user is attached to req
    res.status(200).json({
        valid: true,
        user: req.user
    });
};

exports.logout = (req, res) => {
    // Client-side token removal is primary. 
    // Optionally add token to blacklist here if stateful.
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
