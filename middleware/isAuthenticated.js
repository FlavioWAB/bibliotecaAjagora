var jwt = require('jsonwebtoken');
const secretKey = 'gedtP64CSuTYdnfg';

module.exports = function (req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, secretKey, (err) => {
            if (err) {
                res.send(401).json(err);
            } else {
                var decoded = jwt.decode(bearerToken);
                req.isAdmin = decoded.user.admin == 1;
                req.userId = decoded.user.id;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }

};