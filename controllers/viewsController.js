const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

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

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.showAddReviewForm = (req, res, next) => {
  const movieId = req.params.id;
  res.status(200).render('add_review', {
    title: 'Add Review',
    movieId,
  });
};
