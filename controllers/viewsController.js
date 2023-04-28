const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const { ObjectId } = require('mongodb');

exports.getOverview = factory.getAll(Movie, 'overview', 'All Movies');

exports.getFilterMovie = factory.getAll(Movie, 'overview', 'All Movies');

// exports.getMovie = catchAsync(async (req, res, next) => {
//   // 1) get the data, for the requested movie (including reviews)
//   const movie = await Movie.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'content rating user_id',
//   });

//   if (!movie) {
//     return next(new AppError('There is no movie with that name', 404));
//   }

//   // 2) build template

//   // 3) render template using data from step 1
//   res.status(200).render('movie', {
//     title: 'movie detail',
//     movie,
//   });
// });

exports.getMovie = factory.getOne(
  Movie,
  {
    path: 'reviews',
    fields: 'content rating user_id',
  },
  'movie',
  'movie detail'
);

exports.getReview = factory.getOne(
  User,
  { path: 'reviews', fields: 'content rating movie_id' },
  'user_review',
  'manage my review'
);
exports.deleteReview = catchAsync(async (req, res, next) => {
  // Find the review
  const review = await Review.findById(req.params.id);
  const movieId = review.movie_id;

  // Delete the review
  await Review.findByIdAndDelete(req.params.id);

  // Recalculate the average rating and the number of ratings for the movie
  const stats = await Review.aggregate([
    {
      $match: { movie_id: new ObjectId(movieId) },
    },
    {
      $group: {
        _id: '$movie_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const roundAvg =
    stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : 4.5;
  const newRatingsQuantity = stats.length > 0 ? stats[0].nRating : 0;

  // Update the Movie document with the new average rating and number of ratings
  await Movie.findByIdAndUpdate(
    movieId,
    {
      ratingsQuantity: newRatingsQuantity,
      rating: roundAvg,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Find the User and populate their reviews
  const doc = await User.findById(req.user.id).populate({
    path: 'reviews',
    fields: 'content rating movie_id',
  });

  res.status(200).render('user_review', {
    title: 'manage my review',
    doc,
  });
});

exports.sendEditReviewForm = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).render('user_edit_review', {
    title: 'edit your review',
    review,
  });
});

exports.editReview = catchAsync(async (req, res, next) => {
  // Update the review
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  // Find the associated movie and recalculate the average rating and the number of ratings
  const movieId = updatedReview.movie_id;
  const stats = await Review.aggregate([
    {
      $match: { movie_id: new ObjectId(movieId) },
    },
    {
      $group: {
        _id: '$movie_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // Round the average rating to one decimal place
  const roundAvg =
    stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : 4.5;
  const newRatingsQuantity = stats.length > 0 ? stats[0].nRating : 0;

  // Update the Movie document with the new average rating and number of ratings
  await Movie.findByIdAndUpdate(
    movieId,
    {
      ratingsQuantity: stats[0].nRating,
      rating: roundAvg,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // Find the User and populate their reviews
  const doc = await User.findById(req.user.id).populate({
    path: 'reviews',
    fields: 'content rating movie_id',
  });

  res.status(200).render('user_review', {
    title: 'manage my review',
    doc,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    userId: req.user.id,
  });
};

exports.showAddReviewForm = (req, res, next) => {
  const movieId = req.params.id;
  res.status(200).render('add_review', {
    title: 'Add Review',
    movieId,
  });
};
