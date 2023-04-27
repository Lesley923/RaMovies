const express = require('express');
const viewsController = require('../controllers/viewsController');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');
const movieController = require('../controllers/movieController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/movie', viewsController.getFilterMovie);

router.get('/movie/:slug', authController.protect, viewsController.getMovie);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router
  .route('/review/:id')
  .get(viewsController.showAddReviewForm)
  .post(
    authController.protect,
    reviewController.addUserAndMovieInfo,
    reviewController.createReview
  );

router
  .route('/myReview/:id')
  .get(authController.protect, viewsController.getReview);

router
  .route('/delete/review/:id')
  .get(authController.protect, viewsController.deleteReview);

router
  .route('/edit/review/:id')
  .get(viewsController.sendEditReviewForm)
  .post(authController.protect, viewsController.editReview);

module.exports = router;
