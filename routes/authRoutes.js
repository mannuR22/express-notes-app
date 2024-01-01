const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userMiddleware = require('../middleware/user');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', userMiddleware, authController.logout);
router.get('/cleanup', authController.testUserCleanUp)

module.exports = router;
