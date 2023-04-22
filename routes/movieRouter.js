const express = require('express');
const movieController = require('./../controllers/movieController');
const authController = require('./../controllers/authController');
const router = express.Router();

// router.param('id', movieController.checkID);

router.route('/movie-state').get(movieController.getMovieStats);

router
  .route('/top-5-movies')
  .get(movieController.aliasTopMovies, movieController.getAllMovies);

router
  .route('/admin')
  .get(authController.protect, movieController.getAllMovies);

// router
//   .route('/:id')
//   .get(movieController.getMovie)
//   .patch(movieController.updateMovie)
//   .delete(movieController.deleteMovie);

router.get('/admin/add', movieController.showAddMovieForm);
router.post('/admin/add', movieController.createMovie);
router.get('/edit/:slug', movieController.showEditMovieForm);
router.post('/edit/:slug', movieController.updateMovie);
router.post('/delete/:slug', movieController.deleteMovie); //dlete 有点问题
router.get('/details/:slug', movieController.getMovie);
// router.get('v1/movie/admin/search', movieController.searchMovie);

module.exports = router;
