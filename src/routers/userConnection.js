const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user')

const FRIENDS_DATA = 'firstName lastName age gender photoUrl about skills '

router.get('/user/receivedRequests', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const allReceivedRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id, status : 'interested'
        }).populate('fromUserId', FRIENDS_DATA);

        res.send({allReceivedRequests})
    }
    catch(err){
        res.status(400).send("ERROR: Something Went Wrong!!!" + err.message);
    }
})

router.get('/user/sentRequests', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const allSentRequests = await ConnectionRequest.find({
            fromUserId : loggedInUser, status : 'interested'
        }).populate('toUserId', FRIENDS_DATA);
        res.send({allSentRequests});
    }
    catch(err){
        res.status(400).send("ERROR: Something Went Wrong!!!" + err.message);
    }
})

router.get('/user/connections', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;
        const allFriends = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id, status : 'accepted'},
                {fromUserId : loggedInUser._id, status : 'accepted'}
            ]
        }).populate('fromUserId', FRIENDS_DATA)
          .populate('toUserId', FRIENDS_DATA);

        const data = allFriends.map(connection => {
            const friendData = (connection.fromUserId._id.toString()===loggedInUser._id.toString()) ? {_id : connection._id, data : connection.toUserId} : {_id : connection._id, data :connection.fromUserId};
            return friendData;
        })

        res.json({
            message : `Connection of ${loggedInUser.firstName} ${loggedInUser.lastName}`,
            data});
    }
    catch(err){
        res.status(400).send("ERROR: Something Went Wrong!!! " + err.message);
    }
})

router.get('/user/feed', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit > 50) ? 50 : limit;
        const skip = (page-1)*limit;

        const connections = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id}
            ]
        })
        .select('fromUserId toUserId');

        const hideUsers = new Set();
        connections.forEach(conn => {
            hideUsers.add(conn.fromUserId.toString());
            hideUsers.add(conn.toUserId.toString());
        });

        const showUsers = await User.find({
            _id : { 
                    $nin : Array.from(hideUsers),
                    $ne : loggedInUser._id
                }
        })
        .select(FRIENDS_DATA).skip(skip).limit(limit);
        res.send({users : showUsers});
    }
    catch(err){
        res.status(400).json({message : 'ERROR: Something Went Wrong!!! '});
    }
})

router.post("/connection/remove/:connectId", userAuth, async(req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const connectId = req.params.connectId;
        const status = "accepted";

        const isConnection = await ConnectionRequest.findOne({
            $or : [
                {toUserId : loggedInUserId, _id:connectId, status},
                {fromUserId : loggedInUserId, _id:connectId, status}
            ]
        });
        if(!isConnection) throw new Error("No Connection Exists");

        await ConnectionRequest.deleteOne({_id : isConnection._id});
        res.send({message : "Connection Removed Successfully"});
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

router.get("/allUsers", userAuth, async(req, res)=>{
    try{
        const allUsers = await User.find().select("firstName lastName email photoUrl about skills").sort({firstName : 1, lastName : 1});
        res.send({data : allUsers});
    }
    catch(err){
        res.send({message : "ERROR: " + err.message});
    }
})

router.get("/findChatFriend/:connectId", userAuth, async(req, res)=>{
    try{
        const loggedInUserId = req.user._id;
        const connectId = req.params.connectId;
        const status = "accepted";

        const isConnection = await ConnectionRequest.findOne({
            $or : [
                {toUserId : loggedInUserId, _id:connectId, status},
                {fromUserId : loggedInUserId, _id:connectId, status}
            ]
        });
        if(!isConnection) throw new Error("No Connection Exists");

        const {toUserId, fromUserId} = isConnection;
        const friendId = (toUserId.equals(loggedInUserId) ? fromUserId : toUserId);

        const friend = await User.findById(friendId);
        res.send({data : friend});
    }
    catch(err){
        res.send({message : "ERROR: " + err.message});
    }
})

module.exports = router;