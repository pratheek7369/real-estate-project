const express = require('express');
const router = express.Router();

// Get all users (admin)
router.get('/', (req, res) => {
  // TODO: Fetch all users
  res.send('Get all users');
});

// Get single user
router.get('/:id', (req, res) => {
  // TODO: Fetch user by ID
  res.send('Get single user');
});

module.exports = router; 