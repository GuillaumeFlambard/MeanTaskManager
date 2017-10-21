var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Task = new Schema({
    title: String,
    isDone: Boolean,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', Task);