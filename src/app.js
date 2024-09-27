const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

//Get a User by emailId
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

//Get all the Users
app.get('/feed', async(req, res)=>{
    const allUsers = await User.find({});
    try{
        if(!allUsers) res.send("No User Exists..");
        else res.send(allUsers);
    }
    catch(err){
        res.status(404).send("Something went wrong!!!");
    }
})

//Push the data of a User
app.post('/signup', async(req, res)=>{
    const userData = req.body;
    const user = new User(userData);
    try{
        await user.save();
        res.send('User added Successfully...');
    }
    catch(err) {
        res.status(400).send('Error in Adding User!!!');
    }
});

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




