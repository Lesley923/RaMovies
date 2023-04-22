const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide your username!'],
    unique: [true, 'the username has been used by others'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  email: {
    type: String,
    require: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: {
    type: String,
  },
  registration_data: {
    type: Date,
  },
  follows: {
    type: Array,
  },
  was_followed: {
    type: Array,
  },
});

userSchema.pre('save', async function (next) {
  //only run this function if password  was actully modified
  if (!this.isModified('password')) return next();
  //hash
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //only use for sign up
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
