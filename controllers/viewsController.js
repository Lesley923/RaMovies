const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync.js');

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

exports.getMovie = catchAsync(async (req, res) => {
  // 1) get the data, for the requested movie (including reviews)
  const movie = await Movie.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2) build template

  // 3) render template using data from step 1
  res.status(200).render('movie', {
    title: 'movie detail',
    movie,
  });
});
