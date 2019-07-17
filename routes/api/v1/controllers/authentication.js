var express = require('express');
var router = express.Router();
var model = require('../../../../models/index');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var methodNotAllowed = (req, res, next) => res.sendStatus(405);

const secretKey = 'gedtP64CSuTYdnfg';

router.route("/login").post((req, res) => {
    const {
        username,
        password
    } = req.body;

    model.users.findOne({
        where: {
            username: username
        }
    }).then(user => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.sendStatus(401);
        } else {
            jwt.sign({
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    admin: user.admin
                }
            }, secretKey, (error, token) => {
                if (!error) {
                    res.json({
                        token
                    });
                } else {
                    res.send(500).json({
                        error
                    });
                }
            });
        }
    }).catch(err => {
        res.status(500).json(err);
    });
}).all(methodNotAllowed);

router.route("/isLogged").get((req, res) => {

    const token = req.headers['authorization'];

    if (typeof token !== 'undefined') {
        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, secretKey, (err) => {
            if (!err) {
                var decoded = jwt.decode(bearerToken);
                if(decoded.user.admin == 1){
                    res.json(1);
                } else {
                    res.json(2);
                }
                
            } else {
                res.json(0);
            }
        })
    }
}).all(methodNotAllowed);

module.exports = router;