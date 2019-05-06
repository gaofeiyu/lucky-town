require('module-alias/register');
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


var webpack = require('webpack'),
webpackDevMiddleware = require('webpack-dev-middleware'),
webpackHotMiddleware = require('webpack-hot-middleware'),
webpackDevConfig = require('../webpack.config.js');

var compiler = webpack(webpackDevConfig);

var pageRoute = require('./routes/pageRoute');

var app = express();

// attach to the compiler & the server
app.use(webpackDevMiddleware(compiler, {
  // public path should be the same with webpack config
  publicPath: webpackDevConfig.output.publicPath,
  hot: true,
}));
app.use(webpackHotMiddleware(compiler));

// view engine setup
app.engine('js', require('express-react-views').createEngine());
app.set('view engine', 'js');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.use('/', pageRoute);

// catch 404 and forward to error handler
app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
