const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a username'],
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  registration_data: {
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
