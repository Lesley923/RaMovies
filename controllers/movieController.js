const AppError = require('../utils/appError');
const Movie = require('./../models/movieModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-rating,-year';
  next();
};

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .limiter()
    .limiter()
    .pager();

  const movies = await features.query;

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies: movies,
    },
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    console.log(sb);
    return next(new AppError('No Movie found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!movie) {
    return next(new AppError('No Movie found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      movie: newMovie,
    },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return next(new AppError('No Movie found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMovieStats = catchAsync(async (req, res, next) => {
  const stats = await Movie.aggregate([
    {
      $match: { rating: { $gte: 7 } },
    },
    {
      $group: {
        _id: '$genre',
        numMovies: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        minRating: { $min: '$rating' },
        maxRating: { $max: '$rating' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
