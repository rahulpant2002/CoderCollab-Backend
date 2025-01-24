const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');

const getSecretRoomId = (connectionId)=>{
    return crypto.createHash("sha256").update(connectionId).digest('hex');
}

const initialiseSocket = (server)=>{
    const io = socket(server, {
        cors : {
            origin : "http://localhost:5173",
        }
    });

    io.on('connection', (socket) => { 
        socket.on("joinChat", ({sender, connectionId})=>{
            const roomId = getSecretRoomId(connectionId);
            socket.join(roomId);
        });
        
        socket.on("sendMessage", async({sender, connectionId, message})=>{
            try{
                const roomId = getSecretRoomId(connectionId);
                io.to(roomId).emit("messageReceived", {sender, message});
                let chatHistory = await Chat.findOne({connectionId});
                if(!chatHistory){
                    chatHistory = new Chat({connectionId, messages : []})    
                }
                chatHistory.messages.push({sender, message});
                await chatHistory.save();  
            }
            catch(err){
                console.error(err.message)
            }
        });

        socket.on("disconnect", ()=>{

        });
    }); 
}

module.exports = initialiseSocket;