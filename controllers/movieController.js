const AppError = require('../utils/appError');
const Movie = require('./../models/movieModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const slugify = require('slugify');

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
  res.status(200).render('admin_movie', {
    title: 'Manage',
    movies,
  });

  // res.status(200).json({
  //   status: 'success',
  //   results: movies.length,
  //   data: {
  //     movies: movies,
  // },
  // });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  // const movie = await Movie.findById(req.params.id);
  const movie = await Movie.findOne({ slug: req.params.slug });
  console.log(movie);
  if (!movie) {
    console.log(movie);
    return next(new AppError('No Movie found with that ID', 404));
  }
  res.status(200).render('detail_movie', {
    title: 'Details',
    movie,
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!movie) {
    return next(new AppError('No Movie found with that ID', 404));
  }
  const movies = await Movie.find();
  res.status(200).render('admin_movie', {
    title: 'Manage',
    movies,
  });

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     movie,
  //   },
  // });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);
  const movies = await Movie.find();
  res.status(200).render('admin_movie', {
    title: 'Manage',
    movies,
  });

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     movie: newMovie,
  //   },
  // });
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

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findOneAndDelete({ slug: req.params.slug });
  console.log('sb');
  if (!movie) {
    return next(new AppError('No Movie found with that slug', 404));
  }
  const movies = await Movie.find();
  res.status(200).render('admin_movie', {
    title: 'Manage',
    movies,
  });
  // res.status(204).json({
  //   status: 'success',
  //   data: null,
  // });
});

// exports.searchMovie = catchAsync(async (req, res, next) => {
//   // const movie = await Movie.findById(req.params.id);
//   const queryStr = req.query.query;
//   console.log(queryStr);
//   const movie = await Movie.findOne({ slug: req.params.slug });
//   console.log(movie);
//   if (!movie) {
//     console.log(movie);
//     return next(new AppError('No Movie found with that ID', 404));
//   }
//   res.status(200).render('detail_movie', {
//     title: 'Details',
//     movie,
//   });
// });

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
