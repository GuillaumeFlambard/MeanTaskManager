var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['users']); //"sandbag_mean_01"
var passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function(username, password, done) {

        db.users.findOne({ login: username }, function (err, user) {

            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({"status": false, "info": info});
        }

        return res.json({"status": true, "user": user});
    })(req, res, next);
});

//Get all tasks
router.get('/', function(req, res, next) {
    console.log('Is connected ?');
});

module.exports = router;