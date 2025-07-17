const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  isVerified: { type: Boolean, default: false },
  contact: { type: String }, // phone or other contact info
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 