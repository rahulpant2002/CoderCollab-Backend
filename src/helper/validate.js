const mongoose = require('mongoose');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user')

const validateSignUpData = (req)=>{
    const {lastName, password} = req.body;
    if(!lastName) throw new Error("Lastname is empty");
    if(password.length < 6) throw new Error("Password Length should be atleast 6!!!")
}

const validateProfileEditData = (req)=>{
    const allowedEditFields = ['firstName', 'lastName', 'emailId', 'age', 'gender', 'photoUrl', 'about', 'skills'];

    const isOK = Object.keys(req.body).every(k=>{
        return allowedEditFields.includes(k);
    })
    return isOK;
}

const validateUpdatePasswordData = (req)=>{
    const allowedFields = ['existingPassword', 'updatedPassword'];

    const isOK = Object.keys(req.body).every(k => allowedFields.includes(k));
    return isOK
}

const validateForgotPasswordData = (req)=>{
    const allowedFields = ['firstName', 'lastName', 'emailId', 'Password'];

    const isOK = Object.keys(req.body).every(k => allowedFields.includes(k));
    return isOK;
}

const validateRequestSendData = (req)=>{
    const status = req.params.status;

    const allowedFields = ['ignored', 'interested'];
    const isOK = allowedFields.includes(status);
    if(!isOK) throw new Error(`Invalid Status Type - ${status}!!!`);
}

module.exports = {validateSignUpData, validateProfileEditData, validateUpdatePasswordData,
    validateForgotPasswordData, validateRequestSendData};
