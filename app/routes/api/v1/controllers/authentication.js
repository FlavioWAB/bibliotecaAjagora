var passport = require('../../../../middleware/passport');
var express = require('express');
var router = express.Router();

router.post("/login", passport.authenticate('local'), (req, res) =>{
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

module.exports = router;