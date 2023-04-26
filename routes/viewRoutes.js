const express = require('express');
const viewsController = require('../controllers/viewsController');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get('/movie/:slug', authController.protect, viewsController.getMovie);

router.get('/login', viewsController.getLoginForm);

router
  .route('/review/:id')
  .get(viewsController.showAddReviewForm)
  .post(
    authController.protect,
    reviewController.addUserAndMovieInfo,
    reviewController.createReview
  );

module.exports = router;
