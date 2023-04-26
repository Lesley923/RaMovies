const { async } = require('q');
const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const Movie = require('./../models/movieModel');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.movie_id) req.body.movie_id = req.params.movieId;
  if (!req.body.user_id) req.body.user_id = req.user.id;
  next();
};
exports.addUserAndMovieInfo = (req, res, next) => {
  req.body.user_id = req.user.id;
  req.body.movie_id = req.params.id;
  next();
};
exports.getAllReviews = factory.getAll(Review, 'admin_reviews', 'Manage');
exports.getReview = factory.getOne(Review, null, 'detail_reviews', 'Detail');
exports.createReview = catchAsync(async (req, res, next) => {
  await Review.create(req.body);
  const doc = await Movie.findById(req.params.id).populate({
    path: 'reviews',
    fields: 'content rating user_id',
  });

  res.status(200).render('movie', {
    title: 'movie detail',
    doc,
  });
});
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review, 'admin_reviews', 'Manage');
