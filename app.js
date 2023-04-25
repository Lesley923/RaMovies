const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const movieRouter = require('./routes/movieRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// //middelware
// //set security HTTP headers
// app.use(helmet());
app.use(cors()); 
// This enables CORS for all routes

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//limit request from same API
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/v1', limiter);
app.use(express.json({ limit: '10kb' }));

// //Data sanitization against NoSQL query injection
// app.use(mongoSanitize());
// //Data sanitization against XSS
// app.use(xss());

// //prevent parameters pollution
// app.use(hpp());
// // app.use(hpp({
// //   whitelist:['']
// // }));

//Body parser.reading data from body into req.body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });




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
