const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();
const Chat = require('../models/chat');
const ConnectionRequest = require("../models/connectionRequest");

router.get('/getChatHistory/:connectionId', userAuth, async(req, res)=>{
    try{
        const {connectionId} = req.params;
        const userId = req.user._id;
        
        const findConnection = await ConnectionRequest.findOne({
            _id: connectionId,
            status: "accepted",
            $or: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        });

        if(!findConnection) throw new Error("Connection not Exists in DB!!!");

        const {toUserId, fromUserId} = findConnection;
        if(!userId.equals(toUserId.toString()) && !userId.equals(fromUserId.toString())) throw new Error("You can't Access this Chat!!!");

        const chatHistory = await Chat.findOne({connectionId});
        res.status(200).send({ chatHistory });
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

router.post('/deleteChat/:connectionId', userAuth, async(req, res)=>{
    try{
        const {connectionId} = req.params;
        const userId = req.user._id;
        
        const findConnection = await ConnectionRequest.findOne({
            _id: connectionId,
            status: "accepted",
            $or: [
                { toUserId: userId },
                { fromUserId: userId }
            ]
        });
    
        if(!findConnection) throw new Error("Connection not Exists in DB!!!");
        await Chat.deleteOne({connectionId});
        res.status(200).json("Chat deleted Successfully!!!");
    }
    catch(err){
        res.status(400).send({message : err.message});
    }
})

module.exports = router;