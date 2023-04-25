const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A Movie must have a title'],
    unique: true,
  },
  slug: {
    type: String,
  },
  // secretMovie: {
  //   type: Boolean,
  //   default: false,
  // },
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
    min: [1, 'Rating must be above 1.0 '],
    max: [10, 'Rating must be below 10.0'],
  },
  poster_url: {
    type: String,
  },
  description: {
    type: String,
  },
});

// movieSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'movie',
//   localField: '_id'
// });

movieSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
