const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Movie must have a title'],
    unique: true,
  },
  year: {
    type: Number,
  },
  genre: {
    type: String,
  },
  director: {
    type: String,
  },
  actors: {
    type: Array,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
