var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var formidable = require('formidable');
var fs = require('fs');
var isAuthenticated = require("../../../../middleware/isAuthenticated");
var isAdmin = require("../../../../middleware/isAdmin");

router.get('/', isAuthenticated, (req, res, next) => {
	model.books.findAll({
		where: {
			deleted: 0
		}
	}).then(books => {
		if (books.length == 0 || books[0].id == null) {
			res.status(404).send({
				error: true,
				data: []
			});
		} else {
			res.json({
				error: false,
				data: books
			})
		}
	}).catch(error => {
		res.status(500).send({
			error: error,
			data: []
		});
	})
});

router.get('/:id', isAuthenticated, (req, res, next) => {
	var id = req.params.id;
	model.sequelize.query('SELECT books.id, books.title, books.author, books.publisher, books.description, books.thumbnail, AVG(ratings.rating) as rating FROM books AS books LEFT JOIN ratings AS ratings ON books.id = ratings.bookId WHERE books.id = :id AND books.deleted = \'0\'',
		{ replacements: { id: id }, type: model.sequelize.QueryTypes.SELECT }
	).then(books => {
		if (books.length == 0 || books[0].id == null) {
			res.status(404).send({
				error: true,
				data: []
			});
		} else {

			res.json({
				error: false,
				data: books
			})
		}
	}).catch(error => {
		res.status(500).send({
			error: error,
			data: []
		});
	})
});

router.post('/', isAdmin, (req, res, next) => {
	var form = new formidable.IncomingForm();

	form.uploadDir = "./files";
	form.keepExtensions = true;

	form.parse(req, function (err, fields, files) {
		if (!err) {

			const {
				title,
				author,
				publisher,
				description
			} = fields;

			if (files.thumbnail == undefined) {

				res.status(422).json({
					error: true,
					data: []
				});

			} else {

				model.books.create({

					title: title,
					author: author,
					publisher: publisher,
					description: description,
					thumbnail: files.thumbnail.path.substring(6)

				}).then(book => res.status(201).json({
					error: false,
					data: book
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
				});
			}

		} else {
			res.status(422).json({
				error: err,
				data: []
			})
		}
	});
});

router.put('/:id', isAdmin, (req, res, next) => {

	const id = req.params.id;
	var form = new formidable.IncomingForm();
	var oldFile = '';
	form.uploadDir = "./files";
	form.keepExtensions = true;

	form.parse(req, function (err, fields, files) {
		if (!err) {

			if (files.thumbnail == undefined) {
				model.books.update(fields, {
					where: {
						id: id
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
						});
					} else {
						res.status(500).json({
							error: error,
							data: []
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
						res.status(422).send({
							error: true,
							data: []
						});
					} else {

						oldFile = './files/' + books[0].thumbnail;

						try {
							fs.unlinkSync(oldFile);
						} catch (error) {
							res.status(500).send({
								error: error,
								data: []
							});
							return;
						}

						const updatedFields = fields;
						Object.assign(updatedFields, { thumbnail: files.thumbnail.path.substring(6) });

						if (files.thumbnail == undefined) {

							res.status(422).json({
								error: true,
								data: []
							});

						} else {

							model.books.update(updatedFields, {
								where: {
									id: id
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
									});
								} else {
									res.status(500).json({
										error: error,
										data: []
									});
								}
							});
						}
					}
				}).catch(error => {
					res.status(500).send({
						error: error,
						data: []
					});
				})
			}

		} else {
			res.status(422).json({
				error: error,
				data: []
			});
		}
	});
});

router.delete('/:id', isAdmin, (req, res, next) => {

	const id = req.params.id;

	model.books.update({
		deleted: true
	}, {
			where: {
				id: id
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
				});
			} else {
				res.status(500).json({
					error: error,
					data: []
				});
			}
		});
});

module.exports = router;