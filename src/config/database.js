const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://rahulpant2002:rahulpant2002@codercollab.klkzi.mongodb.net/CoderCollab');
}
module.exports = connectDB;