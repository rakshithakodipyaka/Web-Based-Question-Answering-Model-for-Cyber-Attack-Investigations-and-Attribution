const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation regex
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        match: /^\d{10}$/ // Ensure phone number is exactly 10 digits
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    verified: {
        type: Boolean,
        default: false // Default to false, assuming email verification might be required
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
