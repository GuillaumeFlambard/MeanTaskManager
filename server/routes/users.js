var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['users']); //"sandbag_mean_01"
var passport = require('passport');
const session = require('express-session');
// const RedisStore = require('connect-redis')(session);

const app = express();

const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    console.log('serializing user: ');
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    db.users.find(id, function(err, user) {
        console.log('no im not serial');
        done(err, user);
    });
});

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
    console.log('req.session', req.session);
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

module.exports = router;