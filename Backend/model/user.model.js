// models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email addresses
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Minimum password length
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  // You can add more fields like role, profile picture URL, etc.
});

// Create the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
