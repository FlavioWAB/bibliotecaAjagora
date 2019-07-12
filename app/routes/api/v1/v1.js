var express = require('express');
var router = express();

var booksRouter = require('./controllers/books');
var usersRouter = require('./controllers/users');
var ratingsRouter = require('./controllers/ratings');

router.use('/books', booksRouter);
router.use('/users', usersRouter);
router.use('/ratings', ratingsRouter);

module.exports = router;