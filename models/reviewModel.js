const mongoose = require('mongoose');
const Movie = require('./movieModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    content: {
      type: String,
      required: [true, 'review must have content'],
    },
    review_date: {
      type: Date,
      default: Date.now,
    },
    movie_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Movie',
      required: [true, 'Review must belong to a movie.'],
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'movie_id',
    select: 'title',
  }).populate({
    path: 'user_id',
    select: 'username photo',
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
