const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const {validateSignUpdata} = require('./helper/validate')

const validator = require('validator');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); 

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

        const isPasswordOk = await bcrypt.compare(password, user.password);

        if(isPasswordOk){
            const token = await jwt.sign( {_id : user._id}, "CODERCOLLAB@2024");
            res.cookie("token", token);
            res.send("User login Successfully");
        }
        else throw new Error("Wrong Password");
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
})

app.get('/profile', async(req, res)=>{
    try{
        const token = req.cookies.token;
        if(!token) throw new Error("Login Again!!!");
        
        const msg = await jwt.verify(token, "CODERCOLLAB@2024");
        const {_id} = msg;
        const user = await User.findById(_id);
        console.log("Logged in User is " + user.firstName + " " + user.lastName);

        if(!user) throw new Error("Login Again!!!");
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }
})


app.delete('/user', async(req, res)=>{
    const userId = req.body.id;
    try{
        const user = await User.findByIdAndDelete({_id:userId});
        if(!user) res.send("No User Exist with this ID...");
        else res.send("User deleted Successfully...");
    }
    catch(err){
        res.status(404).send("Something went wrong!!!");
    }
})

app.patch('/user/:id', async(req, res)=>{
    const userId = req.params?.id;
    const userData = req.body;
    try{
        const allowedUpdates = ["password", "age", "photoUrl", "about", "skills"];
        const isAllowed = Object.keys(userData).every((k)=>allowedUpdates.includes(k));
        if(!isAllowed) throw new Error("Updation not Allowed!!!");

        const user = await User.findByIdAndUpdate(userId, userData,
            {
                returnDocument : "after",
                runValidators : true
            }
        );
        res.send("Data updated successfully...");
    }
    catch(err){
        res.status(404).send("Couldn't Update!!! " + err.message);
    }
})

app.get('/user', async(req, res)=>{
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId : userEmail});
        if(!user) res.send("User not Exist...");
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(404).send('Something went wrong!!!');
    }
}); 

app.get('/feed', async(req, res)=>{
    try{
        const allUsers = await User.find({});
        if(!allUsers) res.send("No User Exists..");
        else res.send(allUsers);
    }
    catch(err){
        res.status(404).send("Something went wrong!!!");
    }
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




