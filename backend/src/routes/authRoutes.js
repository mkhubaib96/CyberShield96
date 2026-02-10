const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../utils/validation');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/verify', authenticateToken, authController.verify);
router.post('/logout', authenticateToken, authController.logout);
router.get('/user', authenticateToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;
