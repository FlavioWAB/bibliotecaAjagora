var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.book.findAll({})
		.then(books => res.json({
			error: false,
			data: books
		}))
		.catch(error => res.json({
			error: error,
			data: []
		}))
});

router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	model.book.findAll({
		where: {
			id: id
		}
	})
	.then(books => res.json({
		error: false,
		data: books
	}))
	.catch(error => res.json({
		error: error,
		data: []
	}))
});

router.get('/:id/ratings', function (req, res, next) {
	var id = req.params.id;
	model.rating.findAll({
		where: {
			bookId: id
		}
	})
	.then(books => res.json({
		error: false,
		data: books
	}))
	.catch(error => res.json({
		error: error,
		data: []
	}))
});

module.exports = router;