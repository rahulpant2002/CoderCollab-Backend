const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : [ 'ignored', 'interested', 'accepted', 'rejected'],
            message : '{VALUE} is not a valid status!!!'
        }
    }
},
{
    timestamps : true
});

ConnectionRequestSchema.index({ toUserId : 1, fromUserId : 1 });
ConnectionRequestSchema.index({  _id : 1, status : 1, toUserId : 1});

module.exports = new mongoose.model('ConnectionRequest', ConnectionRequestSchema);