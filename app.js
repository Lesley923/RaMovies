const path = require('path');
const express = require('express');
const fs = require('fs');
const movieRouter = require('./routes/movieRouter');
const morgan = require('morgan');
const app = express();
const movieController = require('./controllers/movieController');
const viewRouter = require('./routes/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
// serving static files
app.use(express.static(path.join(__dirname,'public')));


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
app.use('/', viewRouter);



app.use('/v1/movie', movieRouter);

module.exports = app;
