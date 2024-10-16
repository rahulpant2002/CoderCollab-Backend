const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
const {validateRequestSendData} = require('../helper/validate')

router.post('/request/send/:status/:toUserId', userAuth, async(req, res)=>{
    try{
        validateRequestSendData(req);

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const toUser = await User.findById(toUserId);

        if(!toUser) throw new Error('Receiver doesnot exists!!!');
        if(fromUserId.equals(toUserId)) throw new Error("You cannot send the Request to Yourself!!!");

        const isAlreadySent = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        });
        if(isAlreadySent) throw new Error('Already sent the Connection Request!!!');

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        res.send({
            message : `${req.user.firstName} ${status}, the profile of ${toUser.firstName}`,
            data
        })
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

module.exports = router;