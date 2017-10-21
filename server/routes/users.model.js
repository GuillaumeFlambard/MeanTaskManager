var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    login: String,
    password: String
});

module.exports = mongoose.model('User', User);