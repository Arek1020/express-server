require('dotenv').config({ path: __dirname + '/config.env' })
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var userRouter = require('./routes/user');

var authMiddleware = require('./middleware/authentication');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('*', function (req, res, next) {
  // if (req.headers.origin == 'https://7vzojexaqq' || req.headers.origin == 'http://7vzojexaqq' || req.headers.origin == 'ionic://7vzojexaqq') {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.headers['access-control-request-headers'])
      return res.end()
  // }

  return next();
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(['/', '/account'], accountRouter);
app.use('/user', authMiddleware.requireToken, userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var listener = app.listen(process.env.PORT, () => {
  console.log('listening on port: ', process.env.PORT)
})


module.exports = app;
