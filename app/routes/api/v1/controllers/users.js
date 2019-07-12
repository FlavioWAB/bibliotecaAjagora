var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.user.findAll({})
		.then(users => res.json({
			error: false,
			data: users
		}))
		.catch(error => res.json({
			error: true,
			data: [],
			error: error
		}))
});

module.exports = router;
