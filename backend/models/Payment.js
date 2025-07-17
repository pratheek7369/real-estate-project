const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentId: { type: String }, // Razorpay payment ID
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema); 