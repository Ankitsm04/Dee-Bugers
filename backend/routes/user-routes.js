const express = require('express');
const router = express.Router();
const {Register, Login, getUserProfile } = require('../controllers/user-controllers');
const authMiddleware = require('../middleware/auth-middleware');

router.route('/register').post(Register);
router.route('/login').post(Login);
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;