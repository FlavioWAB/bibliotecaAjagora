var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var formidable = require('formidable');

router.get('/', function (req, res, next) {
	model.ratings.findAll({
		order: [['updatedAt', 'DESC']],
		limit: 3,
		attributes: ['bookId', 'rating']
	}).then(ratings => res.json({
		error: false,
		data: ratings
	})).catch(error => {
		res.status(400);
		res.json({
			error: error,
			data: []
		})
	})
});

router.get('/book/:id', function (req, res, next) {
	var id = req.params.id;

	model.ratings.findAll({
		where: {
			bookId: id
		},
		attributes: ['userId', 'rating']
	}).then(ratings => res.json({
		error: false,
		data: ratings
	})).catch(error => {
		res.status(400);
		res.json({
			error: error,
			data: []
		})
	})
});

router.get('/user/:id', function (req, res, next) {
	var id = req.params.id;

	model.ratings.findAll({
		where: {
			userId: id
		},
		order: [['updatedAt', 'DESC']],
		limit: 3,
		attributes: ['bookId', 'rating']
	}).then(ratings => res.json({
		error: false,
		data: ratings
	})).catch(error => {
		res.status(400);
		res.json({
			error: error,
			data: []
		})
	})
});

router.post('/', (req, res, next) => {
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		if (!err) {

			const {
				bookId,
				userId,
				rating
			} = fields;

			model.ratings.create({

				bookId: bookId,
				userId: userId,
				rating: rating

			}).then(rating => res.status(201).json({
				error: false,
				data: rating
			})).catch(error => {
				if (error.name != undefined && (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')) {
					res.status(422).json({
						error: error.errors,
						data: []
					})
				} else {
					res.status(500).json({
						error: error,
						data: []
					})
				}
			})

		} else {
			res.status(422).json({
				error: error,
				data: []
			})
		}
	});
});

router.put('/user/:userId/book/:bookId', (req, res, next) => {

	const userId = req.params.userId;
	const bookId = req.params.bookId;

	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		if (!err) {

			model.ratings.update(fields, {
				where: {
					userId: userId,
					bookId: bookId
				}
			}).then(affectedRows => {
				if (affectedRows == 0) {
					res.status(404).json({
						error: true,
						data: []
					})
				} else {
					res.status(200).json({
						error: false,
						data: [id]
					})
				}
			}).catch(error => {
				if (error.name != undefined && (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')) {
					res.status(422).json({
						error: error.errors,
						data: []
					})
				} else {
					res.status(500).json({
						error: error,
						data: []
					});
				}
			});

		} else {
			res.status(422).json({
				error: error,
				data: []
			})
		}
	});
});

module.exports = router;