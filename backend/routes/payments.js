const express = require('express');
const router = express.Router();

// Create payment (initiate Razorpay order)
router.post('/', (req, res) => {
  // TODO: Create payment/order
  res.send('Create payment');
});

// Get all payments (admin)
router.get('/', (req, res) => {
  // TODO: Fetch all payments
  res.send('Get all payments');
});

module.exports = router; 