const AppError = require('../utils/appError');
const Movie = require('./../models/movieModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const slugify = require('slugify');
const Review = require('./../models/reviewModel');

exports.aliasTopMovies = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-rating,-year';
  next();
};

// exports.getAllMovies = factory.getAll(Movie);
exports.getAllMovies = factory.getAll(Movie, 'admin_movie', 'Manage');

exports.getMovie = factory.getOne(Movie, null, 'detail_movie', 'Detail');

exports.updateMovie = factory.updateOne(Movie, 'admin_movie', 'Manage');

exports.createMovie = factory.createOne(Movie, 'admin_movie', 'Manage');
// exports.deleteMovie = factory.deleteOne(Movie, 'admin_movie', 'Manage');

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: '_id content rating',
  });

  if (!movie) {
    return next(new AppError('No movie found with that slug', 404));
  }

  // Delete all referenced reviews
  await Promise.all(
    movie.reviews.map(async (review) => {
      await Review.findByIdAndDelete(review._id);
    })
  );

  // Delete the movie
  await Movie.findOneAndDelete({ slug: req.params.slug });
  const datas = await Movie.find();

  res.status(204).render('admin_movie', {
    title: 'Manage',
    datas,
  });
});

// controllers/movieController.js
exports.showAddMovieForm = (req, res, next) => {
  res.status(200).render('add_movie', {
    title: 'Add Movie',
  });
};

exports.showEditMovieForm = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOne({ slug: req.params.slug });

  res.status(200).render('edit_movie', {
    title: 'Edit Movie',
    movie,
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
