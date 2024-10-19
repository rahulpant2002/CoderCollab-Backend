const express = require("express");
const authRouter = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const {validateSignUpData} = require("../helper/validate"); 
const { userAuth } = require("../middlewares/auth");

authRouter.post('/signup', async(req, res)=>{
    try{
        validateSignUpData(req);
        const {firstName, lastName, emailId, password, age, gender, photoUrl, about, skills} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName, lastName, emailId, password : passwordHash, age, gender : gender.toLowerCase(), photoUrl, about, skills
        });
        await user.save();
        res.send(`${firstName} ${lastName} added Successfully...`);
    }
    catch(err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

authRouter.post('/login', async(req, res)=>{
    try{
        const {emailId, password} = req.body;
        if(!validator.isEmail(emailId)) throw new Error("EmailId invalid Format");
        
        const user = await User.findOne({emailId : emailId});
        if(!user) throw new Error("EmailId doesn't exists");

        // const isPasswordOk = await bcrypt.compare(password, user.password);
        const isPasswordOk = await user.validatePassword(password);

        if(isPasswordOk){
            // const token = await jwt.sign( {_id : user._id}, "CODERCOLLAB@2024", {expiresIn : "7d"});
            const token = await user.getToken();
            res.cookie("token", token, {expires : new Date(Date.now() + 10*24*60*60*1000)});
            res.send(`${user.firstName} ${user.lastName} Logged in Successfully...`)
        }
        else throw new Error("Wrong Password");
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

authRouter.post("/logout", userAuth, async(req, res)=>{
    try{
        const user = req.user;
        res.cookie('token', null, {expires : new Date(Date.now())});
        res.send(`${user.firstName} ${user.lastName} Logged Out Successfully...`);
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports =  authRouter;