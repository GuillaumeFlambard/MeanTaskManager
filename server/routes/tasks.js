var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://guillaume:guillaume@ds145188.mlab.com:45188/sandbag_mean', ['tasks']);
var passport = require('passport');

//Get all tasks
router.post('/tasks/count/filter', function(req, res, next) {
    var filters = filtersTreatment(req.body.filters);
    db.tasks.find(filters).count(function (err, countResult) {
        if (err){
            res.send(err);
        }
        res.json(countResult);
    });
});

//Get all tasks
router.post('/tasks/filter', function(req, res, next) {
    var body = req.body;
    var page = body.page;
    page--;
    var pageCount = body.pagecount;
    var filters = filtersTreatment(body.filters);

    db.tasks.find(filters)
        .skip(page*pageCount)
        .limit(parseInt(pageCount))
        .sort({_id: -1}
        , function (err, tasks) {
        if (err){
            res.send(err);
        }
        res.json(tasks);
        // res.status(200).json(posts.data);
    });
});

function filtersTreatment(filters) {

    var filtersTreat = {};

    if (filters.isDone == 'true') {
        filtersTreat.isDone = true;
    }
    else if (filters.isDone == 'false') {
        filtersTreat.isDone = false;
    }
    filtersTreat.title = new RegExp(filters.title, 'i');

    return filtersTreat;
}

//Get single task
router.get('/task/:id', function(req, res, next) {
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function (err, task) {
        if (err){
            res.send(err);
        }
        res.json(task);
    });
});

//Save task
router.post('/task', function(req, res, next) {
    var task = req.body;

    if (!task.title || !(task.isDone + '')) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(task, function (err, task) {
            if (err) {
                res.send(err);
            }
            res.json(task);
        })
    }
});

//Delete task
router.delete('/task/:id', function(req, res, next) {
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function (err, task) {
        if (err){
            res.send(err);
        }
        res.json(task);
    });
});

//Update task
router.put('/task/:id', function(req, res, next) {
    var task = req.body;
    var updTask = {};

    if (task.isDone) {
        updTask.isDone =  task.isDone;
    }

    if (task.title) {
        updTask.title =  task.title;
    }

    if (!updTask) {
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {}, function (err, task) {
            if (err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

module.exports = router;