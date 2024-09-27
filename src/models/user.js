const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    emailId : String,
    password : String,
    age : Number,
    gender : String,
});

module.exports = mongoose.model('User', userSchema);