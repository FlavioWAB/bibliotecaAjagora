var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.books.findAll({})
		.then(books => res.json({
			error: false,
			data: books
		}))
		.catch(error => {
			res.status(400);
			res.json({
				error: error,
				data: []
			})
		})
});

router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	model.sequelize.query('SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail, AVG(ratings.rating) as rating FROM books AS books LEFT JOIN ratings AS ratings ON books.id = ratings.bookId WHERE books.id = :id AND books.status = \'0\'',
		{ replacements: { id: id }, type: model.sequelize.QueryTypes.SELECT }
	)
		.then(books => res.json({
			error: false,
			data: books
		}))
		.catch(error => {
			res.status(400);
			res.json({
				error: error,
				data: []
			})
		})
});

module.exports = router;


