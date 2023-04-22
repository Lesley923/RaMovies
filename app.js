const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const movieRouter = require('./routes/movieRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRoutes');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//middelware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Body parser, reading data from body into req.body
app.use(cookieParser());


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});



//router
app.use('/', viewRouter);
app.use('/v1/movie', movieRouter);
app.use('/v1/user', userRouter);

//global middlewares
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
