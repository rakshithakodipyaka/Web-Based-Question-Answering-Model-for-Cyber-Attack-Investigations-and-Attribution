const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  phone: String,
  otp: String,
  expiresAt: Date,
}, { timestamps: true });

const OTPModel = mongoose.model('OTP', otpSchema);

module.exports = OTPModel;
