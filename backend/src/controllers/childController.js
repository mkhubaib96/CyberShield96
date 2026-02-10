const { validationResult } = require('express-validator');
const db = require('../config/database');
const { ApiError } = require('../utils/errors');

// Get all children for the authenticated user
exports.getChildren = (req, res, next) => {
    const userId = req.user.id;

    db.all('SELECT * FROM children WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) return next(new ApiError(500, 'Database error', err.message));

        res.status(200).json({
            success: true,
            children: rows
        });
    });
};

// Add a new child
exports.addChild = (req, res, next) => {
    console.log('[CHILD] Add child request received');
    console.log('[CHILD] Request body:', req.body);
    console.log('[CHILD] User:', req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[CHILD] Validation errors:', errors.array());
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const userId = req.user.id;
    const { name, age, avatar, age_group } = req.body;

    console.log('[CHILD] Attempting to insert:', { userId, name, age, avatar, age_group });

    const sql = 'INSERT INTO children (user_id, name, age, avatar, age_group) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, name, age, avatar, age_group], function (err) {
        if (err) {
            console.log('[CHILD] Database error:', err);
            return next(new ApiError(500, 'Error creating child', err.message));
        }

        const childId = this.lastID;
        console.log(`[CHILD] New child added: ${name} (ID: ${childId}) by user ${userId}`);

        res.status(201).json({
            success: true,
            message: 'Child added successfully',
            child: {
                id: childId,
                user_id: userId,
                name,
                age,
                avatar,
                age_group,
                created_at: new Date().toISOString()
            }
        });
    });
};

// Update a child
exports.updateChild = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ApiError(400, 'Validation failed', errors.array()));
    }

    const userId = req.user.id;
    const childId = req.params.id;
    const { name, age, avatar, age_group } = req.body;

    // First check if child belongs to user
    db.get('SELECT id FROM children WHERE id = ? AND user_id = ?', [childId, userId], (err, row) => {
        if (err) return next(new ApiError(500, 'Database error', err.message));
        if (!row) return next(new ApiError(404, 'Child not found or unauthorized'));

        const sql = 'UPDATE children SET name = ?, age = ?, avatar = ?, age_group = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.run(sql, [name, age, avatar, age_group, childId], function (err) {
            if (err) return next(new ApiError(500, 'Error updating child', err.message));

            console.log(`[CHILD] Child updated: ${name} (ID: ${childId})`);

            res.status(200).json({
                success: true,
                message: 'Child updated successfully',
                child: {
                    id: parseInt(childId),
                    user_id: userId,
                    name,
                    age,
                    avatar,
                    age_group
                }
            });
        });
    });
};

// Delete a child
exports.deleteChild = (req, res, next) => {
    const userId = req.user.id;
    const childId = req.params.id;

    // First check if child belongs to user
    db.get('SELECT id FROM children WHERE id = ? AND user_id = ?', [childId, userId], (err, row) => {
        if (err) return next(new ApiError(500, 'Database error', err.message));
        if (!row) return next(new ApiError(404, 'Child not found or unauthorized'));

        db.run('DELETE FROM children WHERE id = ?', [childId], function (err) {
            if (err) return next(new ApiError(500, 'Error deleting child', err.message));

            console.log(`[CHILD] Child deleted: ID ${childId} by user ${userId}`);

            res.status(200).json({
                success: true,
                message: 'Child deleted successfully'
            });
        });
    });
};
