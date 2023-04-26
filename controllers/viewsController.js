const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get movie data
  const movies = await Movie.find();

  // 2) build template

  // 3) render that template using tour data from 1)

  res.status(200).render('overview', {
    title: 'All Movies',
    movies,
  });
});

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
  await Review.findByIdAndDelete(req.params.id);
  const doc = await User.findById(req.user.id).populate({
    path: 'reviews',
    fields: 'content rating movie_id',
  });
  res.status(200).render('user_review', {
    title: 'manage my review',
    doc,
  });
});

exports.editReview = catchAsync(async (req, res, next) => {});

exports.sendEditReviewForm = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  res.status(200).render('user_edit_review', {
    title: 'edit your review',
    review,
  });
});

exports.editReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndUpdate(req.params.id, req.body);
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
