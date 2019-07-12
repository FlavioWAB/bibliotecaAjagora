var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.users.findAll({})
		.then(users => res.json({
			error: false,
			data: users
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
	model.users.findAll({
		where: {
			id: id
		}
	})
		.then(users => res.json({
			error: false,
			data: users
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
