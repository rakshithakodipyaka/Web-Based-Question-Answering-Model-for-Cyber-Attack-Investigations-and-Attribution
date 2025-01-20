const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { 
    test, 
    registerUser, 
    loginUser, 
    getProfile, 
    logout, 
    verifyOTP, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); 

// Middleware for CORS
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);
router.use(bodyParser.json());

// Test route
router.get('/', test);

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// Profile route - Protected by auth middleware
router.get('/profile', authMiddleware, getProfile);


module.exports = router;
