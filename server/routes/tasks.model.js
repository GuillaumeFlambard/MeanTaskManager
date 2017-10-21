var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Task = new Schema({
    title: String,
    isDone: Boolean
});

module.exports = mongoose.model('Task', Task);