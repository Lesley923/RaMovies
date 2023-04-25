const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.movie_id) req.body.movie_id = req.params.movieId;
  if (!req.body.user_id) req.body.user_id = req.user.id;
  next();
};
exports.getAllReviews = factory.getAll(Review, 'admin_reviews', 'Manage');
exports.getReview = factory.getOne(Review, null, 'detail_reviews', 'Detail');
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review, 'admin_reviews', 'Manage');
