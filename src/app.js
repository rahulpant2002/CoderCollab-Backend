const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const {validateSignUpdata} = require('./helper/validate')

const validator = require('validator');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); 

const {userAuth} = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async(req, res)=>{
    try{
        validateSignUpdata(req);
        const {firstName, lastName, emailId, password, age, gender, photoUrl, about, skills} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, emailId, password : passwordHash, age, gender, photoUrl, about, skills
        });
        await user.save();
        res.send('User added Successfully...');
    }
    catch(err) {
        res.status(400).send('Error in Adding User!!! ' + err.message);
    }
});

app.post('/login', async(req, res)=>{
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
            res.send("User login Successfully");
        }
        else throw new Error("Wrong Password");
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})

app.get('/profile', userAuth, async(req, res)=>{
    try{
        const user = req.user;
        console.log("Logged in User is " + user.firstName + " " + user.lastName);
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})

app.post('/sendConnectionRequest', userAuth, async(req, res)=>{
    const user = req.user;
    res.send(user.firstName + " sent the Request!");
})



connectDB()
    .then(()=>{
        console.log('Database Connected Successfully...');
        app.listen(7777, ()=>{
            console.log(`Server is running on port 7777`);
        })
    })
    .catch((err)=>{
        console.error('Database Connection not Stablished!!!');
    })




