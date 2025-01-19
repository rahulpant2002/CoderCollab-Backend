const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).send("Login Again!!!")
        }
    
        const msg = await jwt.verify(token, process.env.JWT_TOKEN);
        const userId = msg._id;
        const user = await User.findById(userId);
    
        if(!user) throw new Error("User not found");
        req.user = user;
        next(); 
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = {userAuth};

