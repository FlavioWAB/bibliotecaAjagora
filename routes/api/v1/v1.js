var express = require('express');
var router = express();

var booksRouter = require('./controllers/books');
var usersRouter = require('./controllers/users');
var ratingsRouter = require('./controllers/ratings');
var authenticationRouter = require('./controllers/authentication');

router.use('/books', booksRouter);
router.use('/users', usersRouter);
router.use('/ratings', ratingsRouter);
router.use('/authentication', authenticationRouter);
router.use('/files',express.static('./files'));

module.exports = router;