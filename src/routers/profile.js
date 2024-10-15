const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateProfileEditData, validateUpdatePasswordData} = require('../helper/validate')
const bcrypt = require('bcrypt');

router.get('/profile/view', userAuth, async(req, res)=>{
    try{
        const user = req.user;
        console.log(`Logged in User is ${user.firstName} ${user.lastName}`);
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

router.patch('/profile/edit', userAuth, async(req, res)=>{
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

router.patch('/profile/updatePassword', userAuth, async(req, res)=>{
    try{
        if(!validateUpdatePasswordData(req) ) throw new Error('Enter the Details Correctly!!!')
        const user = req.user;
        const {existingPassword, updatedPassword} = req.body;

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

module.exports = router;