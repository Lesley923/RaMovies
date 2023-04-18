const express = require('express');
const movieController = require('./../controllers/movieController');
const router = express.Router();

// router.param('id', movieController.checkID);

router
  .route('/top-5-movies')
  .get(movieController.aliasTopMovies, movieController.getAllMovies);

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
