const mongoose = require('mongoose');
const Movie = require('./movieModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  content: {
    type: String,
    required: [true, 'review must have content'],
  },
  review_date: {
    type: Date,
  },
  movie_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'Review must belong to a tour.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
