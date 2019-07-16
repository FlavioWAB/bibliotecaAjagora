var passport = require('../../../../middleware/passport');
var express = require('express');
var router = express.Router();

router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(200).json({
        userId: req.user.id
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.status(200).json({});
});

router.get("/logged", (req, res) => {
    if (req.user) {
        if(req.user.admin){
            // Admin
            res.status(200).json(1);
        } else {
            // Usuário
            res.status(200).json(2);
        }
    } else {
        // Não logado
        res.status(200).json(0);
    }
});

module.exports = router;