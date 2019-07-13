var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var model = require('../models/index');
var bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, done) => {
    model.users.findOne({
        where: {
            username: username
        }
    }).then(user => {
        console.log(user.password);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        } else if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        done(null, user);
    }).catch(err => done(err));
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;