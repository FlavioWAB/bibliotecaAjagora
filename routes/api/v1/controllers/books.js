var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var formidable = require('formidable');
var fs = require('fs');
var isAuthenticated = require("../../../../middleware/isAuthenticated");
var methodNotAllowed = (req, res, next) => res.sendStatus(405);

router.route('/').get((req, res, next) => {
	model.books.findAll({
		where: {
			deleted: 0
		}
	}).then(books => {
		if (books.length == 0 || books[0].id == null) {
			res.sendStatus(404);
		} else {
			res.json(books);
		}
	}).catch(error => {
		res.status(500).json({
			error: error
		});
	});
}).post(isAuthenticated, (req, res, next) => {

	if(!req.isAdmin){
		res.sendStatus(403);
		return;
	}

	var form = new formidable.IncomingForm();

	form.uploadDir = "./files";
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (!err) {

			const {
				title,
				author,
				publisher,
				description
			} = fields;

			if (typeof files.thumbnail == 'undefined') {

				res.sendStatus(422);

			} else {

				model.books.create({

					title: title,
					author: author,
					publisher: publisher,
					description: description,
					thumbnail: files.thumbnail.path.substring(6)

				}).then(book => res.status(201).json(
					book
				)).catch(error => {
					if (typeof error.name != 'undefined' && (error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')) {
						res.status(422).json({
							error: error.errors
						})
					} else {
						res.status(500).json({
							error: error
						})
					}
				});
			}

		} else {
			res.status(422).json({
				error: err
			})
		}
	});
}).all(methodNotAllowed);

router.route('/:id').get(isAuthenticated, (req, res, next) => {
	var id = req.params.id;
	var query = 'SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail FROM books AS books WHERE books.id = :id AND books.deleted = \'0\'';

	if (req.isAdmin) {
		query = 'SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail, AVG(ratings.rating) as rating , COUNT(ratings.rating) as ratingCount FROM books AS books LEFT JOIN ratings AS ratings ON books.id = ratings.bookId WHERE books.id = :id AND books.deleted = \'0\''
	}

	model.sequelize.query(query, {
		replacements: {
			id: id
		},
		type: model.sequelize.QueryTypes.SELECT
	}).then(books => {
		if (books.length == 0 || books[0].id == null) {
			res.sendStatus(404);
		} else {
			res.json(books);
		}
	}).catch(error => {
		res.status(500).json({
			error: error
		});
	})
}).put(isAuthenticated, (req, res, next) => {
	if(!req.isAdmin){
		res.sendStatus(403);
		return;
	}
	
	const id = req.params.id;
	var form = new formidable.IncomingForm();
	var oldFile = '';
	form.uploadDir = "./files";
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (!err) {

			console.log(fields);

			if (typeof files.thumbnail == 'undefined') {
				model.books.update(fields, {
					where: {
						id: id
					}
				}).then(affectedRows => {
					if (affectedRows == 0) {
						res.sendStatus(404);
					} else {
						res.status(200).json(id)
					}
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
			} else {
				model.books.findAll({
					where: {
						id: id
					},
					attributes: ['thumbnail']
				}).then(books => {
					if (books.length == 0) {
						res.sendStatus(422);
					} else {

						oldFile = './files/' + books[0].thumbnail;

						try {
							fs.unlinkSync(oldFile);
						} catch (error) {
							res.status(500).json({
								error: error
							});
							return;
						}

						const updatedFields = fields;
						Object.assign(updatedFields, { thumbnail: files.thumbnail.path.substring(6) });

						if (typeof files.thumbnail == 'undefined') {

							res.sendStatus(422);

						} else {

							model.books.update(updatedFields, {
								where: {
									id: id
								}
							}).then(affectedRows => {
								if (affectedRows == 0) {
									res.sendStatus(404);
								} else {
									res.status(200).json(files.thumbnail.path.substring(6))
								}
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
						}
					}
				}).catch(error => {
					res.status(500).json({
						error: error
					});
				})
			}

		} else {
			res.status(422).json({
				error: error
			});
		}
	});
}).delete(isAuthenticated, (req, res, next) => {
	
	if(!req.isAdmin){
		res.sendStatus(403);
		return;
	}

	const id = req.params.id;

	model.books.update({
		deleted: true
	}, {
			where: {
				id: id
			}
		}).then(affectedRows => {
			if (affectedRows == 0) {
				res.sendStatus(404);
			} else {
				res.status(200).json(id);
			}
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
}).all(methodNotAllowed);

router.route('/title/:title').get(isAuthenticated, (req, res, next) => {
	var query = 'SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail FROM books AS books WHERE books.title LIKE :title AND books.deleted = \'0\'';

	if (req.isAdmin) {
		query = 'SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail FROM books AS books WHERE books.title LIKE :title AND books.deleted = \'0\''
	}

	var title = req.params.title;
	model.sequelize.query(query, {
		replacements: {
			title: '%' + title + '%'
		},
		type: model.sequelize.QueryTypes.SELECT
	}).then(books => {
		if (books.length == 0 || books[0].id == null) {
			res.sendStatus(404);
		} else {
			res.json(books)
		}
	}).catch(error => {
		res.status(500).json({
			error: error
		});
	})
}).all(methodNotAllowed);

module.exports = router;