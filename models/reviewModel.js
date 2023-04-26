const mongoose = require('mongoose');
const Movie = require('./movieModel');
const User = require('./userModel');
const { Stats } = require('fs');
const { callbackify } = require('util');

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

reviewSchema.methods.calcAverageRatings = async function (movieId) {
  const stats = await this.aggregate([
    {
      $match: { movie_id: movieId },
    },
    {
      $group: {
        _id: '$movie_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      ratingsQuantity: stats[0].nRating,
      rating: stats[0].avgRating,
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      ratingsQuantity: 0,
      rating: 5,
    });
  }
};

// reviewSchema.post('save', function () {
//   this.constructor.calcAverageRatings(this.movie_id);
// });

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   const r = await this.findOne();
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calcAverageRatings(this.r.movie_id);
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
