var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var bcrypt = require('bcrypt');
var isAuthenticated = require("../../../../middleware/isAuthenticated");


router.get('/', function (req, res, next) {
	model.users.findAll({
		where: {
			deleted: false
		}
	}).then(users => {
		if (users.length == 0 || users[0].id == null) {
			res.sendStatus(404);
		} else {
			res.json(users);
		}
	}).catch(error => {
		res.status(500).send({
			error: error
		});
	});
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
			res.sendStatus(404);
		} else {
			res.json(users);
		}
	}).catch(error => {
		res.status(500).send({
			error: error
		});
	});
});

router.post('/', (req, res, next) => {
	const {
		firstName,
		lastName,
		username,
		password,
		admin
	} = req.body;

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
	});
});

router.put('/:id', isAuthenticated, (req, res, next) => {

	const id = req.params.id;
	const fields = req.body;

	if (req.user.id != req.params.id) {
		res.sendStatus(400);
	}

	if (typeof fields.password != 'undefined') {
		bcrypt.hash(fields.password, 10, function (err, hash) {
			fields.password = hash;
			model.users.update(fields, {
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
		});
	} else {
		model.users.update(fields, {
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
	}
});

router.delete('/:id', isAuthenticated, (req, res, next) => {

	const id = req.params.id;

	if (req.user.id != req.params.id) {
		res.sendStatus(400);
	}

	model.users.update({
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
});

module.exports = router;
