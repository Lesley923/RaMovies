const path = require('path');
const express = require('express');
const fs = require('fs');
const movieRouter = require('./routes/movieRouter');
const morgan = require('morgan');
const app = express();
const movieController = require('./controllers/movieController');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//middelware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//router
app.use('/v1/movie', movieRouter);

module.exports = app;
