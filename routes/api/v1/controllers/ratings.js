var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var isAuthenticated = require("../../../../middleware/isAuthenticated");
var isAdmin = require("../../../../middleware/isAdmin");

router.get('/', isAdmin, (req, res, next) => {
	model.ratings.findAll({
		order: [['updatedAt', 'DESC']],
		limit: 3,
		attributes: ['rating'],
		include: [{
            model: model.books,
            attributes: ['author','description','publisher','thumbnail','title']
        }]
	}).then(ratings => {
		res.json(ratings);
	}).catch(error => {
		res.status(400).json({
			error: error
		});
	});
});

router.get('/book/:id', isAdmin, (req, res, next) => {
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
});

router.get('/user/', isAuthenticated, (req, res, next) => {
	var id = req.user.id;

	model.ratings.findAll({
		where: {
			userId: id
		},
		order: [['updatedAt', 'DESC']] 	,
		limit: 3,
		attributes: ['rating'],
		include: [{
            model: model.books,
            attributes: ['author','description','publisher','thumbnail','title']
        }]
	}).then(ratings => res.json(ratings)).catch(error => {
		res.status(400).json({
			error: error
		});
	});
});

router.post('/', (req, res, next) => {
	const {
		bookId,
		userId,
		rating
	} = req.body;

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
});

router.put('/user/:userId/book/:bookId', (req, res, next) => {

	const userId = req.params.userId;
	const bookId = req.params.bookId;

	model.ratings.update(req.body, {
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
});

module.exports = router;