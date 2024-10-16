const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
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

connectionRequestSchema.index({ toUserId : 1, fromUserId : 1 });

module.exports = new mongoose.model('ConnectionRequest', connectionRequestSchema);