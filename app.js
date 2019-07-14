var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./middleware/passport');
var bodyParser = require("body-parser");
var cors = require('cors')

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/api');

var port = process.env.PORT || 5000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(function (req, res, next) {
	next(createError(404));
});

app.use(function (err, req, res, next) {

	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);
	res.status(err.status || 500);
	res.json({error: err.message});

});

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
	console.info('Running on '+port);
})

module.exports = app;
