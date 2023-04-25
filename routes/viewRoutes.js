const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/movie/:slug', viewsController.getMovie);

router.get('/login', viewsController.getLoginForm);

module.exports = router;
