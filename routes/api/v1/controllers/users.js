var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var formidable = require('formidable');
var bcrypt = require('bcrypt');
var isAuthenticated = require("../../../../middleware/isAuthenticated");


router.get('/', function (req, res, next) {
	model.users.findAll({
		where: {
			deleted: false
		}
	}).then(users => {
		if (users.length == 0 || users[0].id == null) {
			res.status(404).send({
				error: true,
				data: []
			});
		} else {
			res.json({
				error: false,
				data: users
			})
		}
	}).catch(error => {
		res.status(500).send({
			error: error,
			data: []
		});
	})
});

router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	model.users.findAll({
		where: {
			id: id,
			deleted: false
		}
	}).then(users => {
		if (users.length == 0 || users[0].id == null) {
			res.status(404).send({
				error: true,
				data: []
			});
		} else {
			res.json({
				error: false,
				data: users
			})
		}
	}).catch(error => {
		res.status(500).send({
			error: error,
			data: []
		});
	})
});

router.post('/', (req, res, next) => {
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		if (!err) {

			const {
				firstName,
				lastName,
				username,
				password,
				admin
			} = fields;

			bcrypt.hash(password, 10, function (err, hash) {
				model.users.create({

					firstName: firstName,
					lastName: lastName,
					username: username,
					password: hash,
					admin: admin

				}).then(user => res.status(201).json({
					error: false,
					data: user
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
			});

		} else {
			res.status(422).json({
				error: error,
				data: []
			})
		}
	});
});

router.put('/:id', isAuthenticated, (req, res, next) => {

	const id = req.params.id;
	var form = new formidable.IncomingForm();

	if (req.user.id != req.params.id) {
		res.status(400).json({
			error: true,
			data: []
		});
	}

	form.parse(req, function (err, fields, files) {
		if (!err) {
			if (fields.password != undefined) {
				bcrypt.hash(fields.password, 10, function (err, hash) {
					fields.password = hash;
					model.users.update(fields, {
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
							})
						} else {
							res.status(500).json({
								error: error,
								data: []
							});
						}
					});
				});
			} else {
				model.users.update(fields, {
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
						})
					} else {
						res.status(500).json({
							error: error,
							data: []
						});
					}
				});
			}

		} else {
			res.status(422).json({
				error: error,
				data: []
			})
		}
	});
});

router.delete('/:id', isAuthenticated, (req, res, next) => {

	const id = req.params.id;

	if (req.user.id != req.params.id) {
		res.status(400).json({
			error: true,
			data: []
		});
	}

	model.users.update({
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
				});
			} else {
				res.status(200).json({
					error: false,
					data: [id]
				});
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
