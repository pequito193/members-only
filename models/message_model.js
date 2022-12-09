const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    username: {type: String, required: true},
    date: {type: String, required: true},
    text: {type: String, required: true}
});

module.exports = mongoose.model('Messages', MessageSchema);