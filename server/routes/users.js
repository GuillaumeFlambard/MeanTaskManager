var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['users']); //"sandbag_mean_01"
var passport = require('passport');
// const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
var app = express();

/**
 * Passport serialize user
 */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

/**
 * Passport deserialize user
 */
passport.deserializeUser(function(id, done) {
    var ObjectId = require('mongodb').ObjectID;
    db.users.find({ _id: ObjectId(id) }, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});

/**
 * Passport declaration of the local strategy
 */
passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function(username, password, done) {
        db.users.findOne({ login: username }, function (err, user) {

            if (err) {
                return done(err);
            }

            // If there is not user with this login
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            // If the password doesn't match
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
    }
));

/**
 * Check if there is a user already connected
 */
router.get('/is/authenticate', function(req, res, next) {
    var user = req.user;
    if (user)
    {
        user = user[0];
    }

    return res.json({"user": user});
});

/**
 * Login action
 */
router.post('/login', function(req, res, next) {
    authentification(req, res, next);
});

/**
 * Try to authentificate the user
 * @param req
 * @param res
 * @param next
 */
function authentification(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({"status": false, "info": info});
        }

        req.login(user, function(err) {
            if (err) {
                // return res.json({"status": false, "err": err});
            }

            // return res.json({"status": true, "user": user});
        });

        return res.json({"status": true, "user": user});
    })(req, res, next);
}

/**
 * Registration action
 * If the registration succed try to connect the user
 */
router.post('/registration', function(req, res, next) {
    var currentUser = req.body;
    db.users.findOne({ login: currentUser.login }, function (err, user) {

        if (err) {
            return res.send(err);
        }

        if (user) {
            return res.json({ status: false, message: 'Login already used.' });
        } else {
            db.users.save(currentUser, function (err, user) {
                if (err)
                {
                    return res.json({ status:'fail' });
                }
                return authentification(req, res, next);
            });
        }
    });
});

/**
 * Logout action
 */
router.get('/logout', function(req, res, next) {
    req.logout();

    return res.json({"success": true});
});

module.exports = router;