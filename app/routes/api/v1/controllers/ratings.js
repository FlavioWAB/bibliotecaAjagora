var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');

router.get('/', function (req, res, next) {
	model.ratings.findAll({})
		.then(ratings => res.json({
			error: false,
			data: ratings
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
