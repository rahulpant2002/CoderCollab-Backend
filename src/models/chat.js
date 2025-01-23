const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        required : true
    }

}, {timestamps : true});

const chatSchema = new mongoose.Schema({
    connectionId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User",
    },
    messages : [messageSchema]
});

const chatModel = mongoose.model('Chat', chatSchema);
module.exports = chatModel;