var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var isAuthenticated = require("../../../../middleware/isAuthenticated");
var methodNotAllowed = (req, res, next) => res.sendStatus(405);

router.route('/').get(isAuthenticated, (req, res, next) => {
	if (!req.isAdmin) {
		res.sendStatus(403);
		return;
	}

	model.ratings.findAll({
		order: [['updatedAt', 'DESC']],
		limit: 3,
		attributes: ['rating'],
		include: [{
			model: model.books,
			attributes: ['author', 'description', 'publisher', 'thumbnail', 'title'],
			where: {
				deleted: 0
			}
		}]
	}).then(ratings => {
		res.json(ratings);
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	});
}).post(isAuthenticated, (req, res, next) => {
	const {
		bookId,
		rating
	} = req.body;

	const userId = req.userId;

	model.ratings.create({

		bookId: bookId,
		userId: userId,
		rating: rating

	}).then(rating => {
		res.status(201).json(rating);
	}).catch(error => {
		if (typeof error.name != 'undefined' && (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')) {
			res.status(422).json({
				error: error.errors
			});
		} else {
			res.status(500).json({
				error: error
			});
		}
	});
}).put(isAuthenticated, (req, res, next) => {

	const userId = req.userId;
	const bookId = req.body.bookId;
	const rating = req.body.rating;

	model.ratings.update({ rating: rating }, {
		where: {
			userId: userId,
			bookId: bookId
		}
	}).then(affectedRows => {
		if (affectedRows == 0) {
			res.sendStatus(404);
		} else {
			res.status(200).json('');
		}
	}).catch(error => {
		if (typeof error.name != 'undefined' && (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')) {
			res.status(422).json({
				error: error.errors
			})
		} else {
			res.status(500).json({
				error: error
			});
		}
	});
}).all(methodNotAllowed);

router.route('/book/:id').get(isAuthenticated, (req, res, next) => {
	if (!req.isAdmin) {
		res.sendStatus(403);
		return;
	}

	var id = req.params.id;

	model.ratings.findAll({
		where: {
			bookId: id
		},
		attributes: ['userId', 'rating']
	}).then(ratings => {
		res.json(ratings);
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	});
}).all(methodNotAllowed);

router.route('/user/').get(isAuthenticated, (req, res, next) => {
	var id = req.userId;

	model.ratings.findAll({
		where: {
			userId: id
		},
		order: [['updatedAt', 'DESC']],
		limit: 3,
		attributes: ['rating'],
		include: [{
			model: model.books,
			attributes: ['author', 'description', 'publisher', 'thumbnail', 'title']
		}]
	}).then(ratings => res.json(ratings)).catch(error => {
		res.status(400).json({
			error: error
		});
	});
}).all(methodNotAllowed);

router.route('/user/:bookId').get(isAuthenticated, (req, res, next) => {
	var userId = req.userId;
	var bookId = req.params.bookId;

	model.ratings.findOne({
		where: {
			userId: userId,
			bookId: bookId
		},
		attributes: ['rating']
	}).then(ratings => {
		if (ratings == null) {
			res.sendStatus(404);
		} else {
			res.json(ratings)
		}
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	});

}).all(methodNotAllowed);

module.exports = router;