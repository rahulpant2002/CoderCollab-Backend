const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData, validateUpdatePasswordData, validateForgotPasswordData} = require('../helper/validate')
const bcrypt = require('bcrypt');
const User = require('../models/User')

router.get('/profile/view', userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

router.put('/profile/edit', userAuth, async(req, res)=>{
    try{
        if( !validateProfileEditData(req)) {
            throw new Error("Information can't be updated!!!");
        }
        
        const user = req.user;
        Object.keys(req.body).forEach(k => user[k] = req.body[k]);
        await user.save();

        res.json({
            message : `${user.firstName} ${user.lastName}, your Profile Updated Successfully...`,
            data : user
        });
    }
    
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

router.put('/profile/updatePassword', userAuth, async(req, res)=>{
    try{
        if(!validateUpdatePasswordData(req) ) throw new Error('Enter the Details Correctly!!!')
        
        const {existingPassword, updatedPassword} = req.body;
        if(updatedPassword.length < 6) throw new Error('Password Length should be atleast 6');

        const user = req.user;
        
        const isOK = await bcrypt.compare(existingPassword, user.password);
        if(!isOK) throw new Error("Enter Correct Existing Password!!!");

        const hashPassword = await bcrypt.hash(updatedPassword, 10);
        user.password = hashPassword;
        await user.save();

        res.send(`${user.firstName} ${user.lastName}, your Password Updated Successfully...`);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

router.put('/profile/forgotPassword', async(req, res)=>{
    try{
        if( !validateForgotPasswordData(req)) throw new Error("Invalid Credentials!!!");

        const {firstName, lastName, emailId, newPassword} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user) throw new Error('EmailId does not exists!!!');
        if( !(firstName === user.firstName && lastName === user.lastName) ) throw new Error(`Invalid Credentials!!!`);

        if(newPassword.length < 6) throw new Error("Password Length should be atleast 6!!!")
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.send(`${user.firstName} ${user.lastName}, your Password Updated Successfully...`);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

module.exports = router;