const express = require('express');
const viewsController = require('../controllers/viewsController');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/', authController.isLoggedIn, viewsController.getOverview);


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

module.exports = router;
