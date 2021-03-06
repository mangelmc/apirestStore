var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var restaurantsRouter = require('./routes/api/restaurantes');
var ordenesRouter = require('./routes/api/ordenes');
var usuariosRouter = require('./routes/api/usuarios');
var menusRouter = require('./routes/api/menus');

const port = process.env.PORT || 8000;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/restaurantes', restaurantsRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ordenes', ordenesRouter);
app.use('/api/menus', menusRouter);


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

  /* res.json({
    error: err.message
  }) */
  res.render('error');
});

app.listen(port, () => {
  console.log('corriendo en el puerto : ' + port);
})
module.exports = app;