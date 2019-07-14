var passport = require('../../../../middleware/passport');
var express = require('express');
var router = express.Router();

router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(200).json({
        data: []
    });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.status(200).json({
        data: []
    });
});

router.get("/logged", (req, res) => {
    if (req.user) {
        if(req.user.admin){
            // Admin
            res.status(200).json({
                data: 1
            });
        } else {
            // Usuário
            res.status(200).json({
                data: 2
            });
        }
    } else {
        // Não logado
        res.status(200).json({
            data: 0
        });
    }
});

module.exports = router;