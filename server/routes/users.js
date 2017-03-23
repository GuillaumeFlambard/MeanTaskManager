var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['users']);
var passport = require('passport');

//Get all tasks
router.get('/authentificate', function(req, res, next) {
    var task = req.body;
});
