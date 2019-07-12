var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.rating.findAll({})
		.then(ratings => res.json({
			error: false,
			data: ratings
		}))
		.catch(error => res.json({
			error: true,
			data: [],
			error: error
		}))
});

module.exports = router;
