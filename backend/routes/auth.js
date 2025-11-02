const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Initialize default admin if not exists
const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const defaultAdmin = new Admin({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      });
      await defaultAdmin.save();
      console.log('✅ Default admin created');
    }
  } catch (error) {
    console.error('⚠️  Cannot initialize admin - MongoDB not connected:', error.message);
  }
};

// Try to initialize admin when MongoDB connects
const mongoose = require('mongoose');
if (mongoose.connection.readyState === 1) {
  initializeAdmin();
} else {
  mongoose.connection.once('connected', () => {
    initializeAdmin();
  });
}

// Login
router.post('/login', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.',
        error: 'MongoDB connection required'
      });
    }

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      username: admin.username
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error during login',
      error: 'Database operation failed'
    });
  }
});

// Verify token middleware (can be used in other routes)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/verify', verifyToken, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        valid: false,
        message: 'Database not connected'
      });
    }
    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

module.exports = router;

