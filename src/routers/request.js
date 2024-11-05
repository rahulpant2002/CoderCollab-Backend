const express = require("express");
const router = express.Router();
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
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
            message : `${req.user.firstName} ${status}, the profile of ${toUser.firstName} ${toUser.lastName}`,
            data
        })
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

router.post('/request/review/:status/:requestId', userAuth, async(req, res)=>{
    try{
        const toUserId = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;

        if(!(status==='accepted' || status==='rejected')) throw new Error(`Invalid Status - ${status}!!!`);

        const isRequest = await ConnectionRequest.findOne({_id : requestId, status : 'interested', toUserId });
        if(!isRequest) throw new Error('Request doesnot exists!!!');

        let data;
        if(status==='accepted'){   
            isRequest.status = status;
            data = await isRequest.save();
        }
        else{
            data = await ConnectionRequest.deleteOne({_id : isRequest._id});
        }

        const {fromUserId}= isRequest;
        const fromUser = await User.findById(fromUserId);

        res.send({
            message : `${req.user.firstName} ${status} the Request of ${fromUser.firstName} ${fromUser.lastName}`,
            data
        })
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

router.post('/request/cancel/:requestId', userAuth, async(req, res)=>{
    try{
        const fromUserId = req.user._id;
        const requestId = req.params.requestId;
        const status = 'interested';

        const isRequest = await ConnectionRequest.findOne({_id : requestId, status, fromUserId});
        if(!isRequest) throw new Error("No Request Exists!!!");
        await ConnectionRequest.deleteOne({_id : isRequest._id});

        res.send({message : "Deleted Request Successfully"});
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = router;