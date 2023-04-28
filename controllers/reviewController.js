// const { async } = require('q');
const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const Movie = require('./../models/movieModel');
const { ObjectId } = require('mongodb');

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
  const review = await Review.create(req.body);
  const stats = await Review.aggregate([
    {
      $match: { movie_id: new ObjectId(req.params.id) },
    },
    {
      $group: {
        _id: '$movie_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  const roundAvg = parseFloat(stats[0].avgRating.toFixed(1));

  const doc = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      ratingsQuantity: stats[0].nRating,
      rating: roundAvg,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: 'reviews',
    fields: 'content rating user_id',
  });
  console.log(doc);

  res.status(200).render('movie', {
    title: 'movie detail',
    doc,
  });
});

exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review, 'admin_reviews', 'Manage');

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

  const datas = await Review.find();

  res.status(200).render('admin_reviews', {
    title: 'Manage',
    datas,
  });
});
