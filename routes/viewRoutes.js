const express = require('express');
const viewsController = require('../controllers/viewsController');
const movieController = require('./../controllers/movieController');

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/movie/:slug', viewsController.getMovie);

router.get('/admin/movie', movieController.getAllMovies);

router.get('/admin/addmovie', movieController.showAddMovieForm);

router.post('/admin/addmovie', movieController.createMovie);

router.delete('/delete/:slug', movieController.deleteMovie);

module.exports = router;
