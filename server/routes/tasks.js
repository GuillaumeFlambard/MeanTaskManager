var express = require('express');
var router = express.Router();
var dbTask = require('./../models/tasks.model.js');
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;

function requireLogin(req, res, next) {
    console.log(req.user);
    if (typeof req.user !== "undefined") {
        next();
    } else {
        res.json({'status':'notConnected'});
    }
}

router.all("/tasks/*", requireLogin, function(req, res, next) {
    next();
});

/**
 * Count all tasks with filters
 */
router.post('/tasks/count/filter', function(req, res, next) {
    var filters = filtersTreatment(req.body.filters, req.user[0]._id);
    dbTask.find(filters).count(function (err, countResult) {
        if (err){
            res.send(err);
        }
        res.json({'status':'connected', 'totalEntries':countResult});
    });
});

/**
 * Get tasks with filter and pagination
 */
router.post('/tasks/filter', function(req, res, next) {
    var body = req.body;
    var page = body.page;
    page--;
    var pageCount = body.pagecount;
    var filters = filtersTreatment(body.filters, req.user[0]._id);

    dbTask.find(filters)
        .skip(page*pageCount)
        .limit(parseInt(pageCount))
        .sort({_id: -1}).exec(
            function (err, tasks) {
                if (err){
                    res.send(err);
                }
                res.json({'status':'connected', 'tasks':tasks});
                // res.status(200).json(posts.data);
            });
});

/**
 * Format filter data
 * Insert current user_id in filters
 * @param filters
 * @param user_id
 * @returns {{}}
 */
function filtersTreatment(filters, user_id) {
    var filtersTreat = {};
    filtersTreat.user = ObjectId(user_id);

    if (filters.isDone == 'true') {
        filtersTreat.isDone = true;
    }
    else if (filters.isDone == 'false') {
        filtersTreat.isDone = false;
    }
    filtersTreat.title = new RegExp(filters.title, 'i');

    return filtersTreat;
}

/**
 * Get single task by id
 */
router.get('/tasks/:id', function(req, res, next) {
    dbTask.findOne({_id: ObjectId(req.params.id)}, function (err, task) {
        if (err){
            res.send(err);
        }
        res.json({'status':'connected', 'task':task});
    });
});

/**
 * Save task with current user
 * Emit instructions
 */
router.post('/tasks/create', function(req, res, next) {
    var task = req.body;
    task.user = ObjectId(req.user[0]._id);

    if (!task.title || !(task.isDone + '')) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        dbTask.create(task, function (err, task) {
            if (err) {
                res.send(err);
            }
            req.app.io.emit('addTask', task);
            res.json({'status':'connected', 'task':task});
        })
    }
});

/**
 * Delete task
 * Emit instructions
 */
router.delete('/tasks/:id', function(req, res, next) {
    var task = {'id': req.params.id, 'user': ObjectId(req.user[0]._id)};
    req.app.io.emit('deleteTask', task);
    dbTask.remove({_id: ObjectId(req.params.id)}, function (err, task) {
        if (err){
            res.send(err);
        }
        res.json({'status':'connected', 'task':task});
    });
});

/**
 * Update task with id
 */
router.put('/tasks/:id', function(req, res, next) {
    var task = req.body;
    task.user = ObjectId(req.user[0]._id);
    req.app.io.emit('checkTask', task);
    var updTask = {};

    if (task.isDone) {
        updTask.isDone =  task.isDone;
    }

    if (task.title) {
        updTask.title =  task.title;
    }

    if (req.user.length > 0) {
        updTask.user =  ObjectId(req.user[0]._id);
    }

    if (!updTask) {
        res.status(400);
        res.json({
            'status':'connected',
            'error':'Bad Data'
        });
    } else {
        dbTask.update({_id: ObjectId(req.params.id)}, updTask, {}, function (err, task) {
            if (err){
                res.send(err);
            }
            res.json({'status':'connected', 'task':task});
        });
    }
});

module.exports = router;