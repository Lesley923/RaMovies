const express = require('express');
const movieController = require('./../controllers/movieController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const router = express.Router();
const reviewRouter = require('./reviewRouter');

// router.param('id', movieController.checkID);

router.route('/movie-state').get(movieController.getMovieStats);

router
  .route('/top-5-movies')
  .get(movieController.aliasTopMovies, movieController.getAllMovies);

router.route('/').get(
  authController.protect,
  authController.restrictTo('admin'),
  movieController.getAllMovies
);

router.get('/add', authController.protect, movieController.showAddMovieForm);
router.post('/add',authController.protect, movieController.createMovie);
router.get('/edit/:slug', authController.protect, movieController.showEditMovieForm);
router.post('/edit/:slug',authController.protect, movieController.updateMovie);
router.post('/delete/:slug', movieController.deleteMovie);
router.get('/details/:slug', authController.protect, movieController.getMovie);
// router
//   .route('/:movieId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:movieId/reviews', reviewRouter);
router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
