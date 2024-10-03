const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        maxLength : 30,
        required : true,
        validate(value){
            if(value.length < 4 || value.length > 30) throw new Error("Firstname is invalid!!!")
        }
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid Email format. ");
        }  
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
        validate(value){
            if(value.length < 6) throw new Error("Password length should atleast 6")
        }
    },
    age : {
        type : String,
        min : 18,
        validate(x){
            if(x < 18) throw new Error("User must be 18+");
        }
    },
    gender : {
        type : String,
        required : true,
        validate(value){
            if(!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is Invalid !!!");
            }
        }
    },
    photoUrl : {
        type : String,
        default : "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
        validate(value){
            if(!validator.isURL(value)) throw new Error("Invalid Photo")
        }
    },
    about : {
        type : String,
    },
    skills : {
        type : [String],
        validate(value){
            if(value.length > 10) throw new Error("Maximum 10 Skills are allowed")
        }
    }
},
{
    timestamps : true
});

userSchema.methods.getToken = async function(){
    const user = this;
    const token = await jwt.sign({_id : user._id}, "CODERCOLLAB@2024", {expiresIn : "7d"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordEntered){
    const isOk = await bcrypt.compare(passwordEntered, this.password);
    return isOk;
}

module.exports = mongoose.model('User', userSchema);