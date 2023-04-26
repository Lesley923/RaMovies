const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
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
    passwordResetToken: String,
    passwordResetExpires: Date,
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
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    registration_date: {
      type: Date,
      default: Date.now,
    },
    follows: {
      type: Array,
    },
    was_followed: {
      type: Array,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user_id',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  //only run this function if password  was actully modified
  if (!this.isModified('password')) return next();
  //hash
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //only use for sign up
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  // console.log(result);
  return result;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
