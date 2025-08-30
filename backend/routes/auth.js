const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // You need to install jsonwebtoken
const User = require('../models/User');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong secret key

// Generate a JWT token
const generateToken = (id, username, isAdmin) => {
  return jwt.sign({ id, username, isAdmin }, JWT_SECRET, { expiresIn: '1d' });
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }
    
    const user = User.findByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const token = generateToken(user.id, user.username, user.isAdmin);
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;