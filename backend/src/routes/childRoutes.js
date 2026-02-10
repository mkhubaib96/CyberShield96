const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const childController = require('../controllers/childController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Validation rules for child
const validateChild = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('age')
        .isInt({ min: 1, max: 18 })
        .withMessage('Age must be between 1 and 18'),
    body('avatar')
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage('Avatar must be 1-10 characters'),
    body('age_group')
        .isIn(['6-9', '10-13', '14-17'])
        .withMessage('Age group must be 6-9, 10-13, or 14-17')
];

// All routes require authentication
router.use(authenticateToken);

// Child routes
router.get('/', childController.getChildren);
router.post('/', validateChild, childController.addChild);
router.put('/:id', validateChild, childController.updateChild);
router.delete('/:id', childController.deleteChild);

module.exports = router;
