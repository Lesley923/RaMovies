const Movie = require('../models/movieModel');
const catchAsync = require('../')


exports.getOverview = (req,res) => {
    // 1) get movie data


    // 2) build template

    // 3) render that template using tour data from 1)

    res.status(200).render('overview', {
      title: 'All Movies'
    });
  };

exports.getMovie = (req,res) => {
    res.status(200).render('movie', {
      title: 'one movie'
    });
  };