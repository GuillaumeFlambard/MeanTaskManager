var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['users']); //"sandbag_mean_01"
var passport = require('passport');
// const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
var app = express();

passport.serializeUser(function(user, done) {
    console.log('serializing user: ', user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser id', id);
    var ObjectId = require('mongodb').ObjectID;
    db.users.find({ _id: ObjectId(id) }, function(err, user) {
        if (err) { return done(err); }
        console.log('deserializeUser done', user);
        done(null, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function(username, password, done) {
    console.log("informations", username, password);
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

router.get('/is/authenticate', function(req, res, next) {
    var user = req.user;
    if (user)
    {
        user = user[0];
    }

    return res.json({"user": user});
});

router.post('/login', function(req, res, next) {
    authentification(req, res, next);
});

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

router.post('/registration', function(req, res, next) {
    var currentUser = req.body;
    console.log('currentUser', currentUser);
    db.users.findOne({ login: currentUser.login }, function (err, user) {

        if (err) {
            return res.send(err);
        }

        if (user) {
            console.log('Login already exist...');
            return res.json({ status: false, message: 'Login already used.' });
        } else {
            console.log('Fail find someone');
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

router.get('/logout', function(req, res, next) {
    req.logout();

    return res.json({"success": true});
});

module.exports = router;