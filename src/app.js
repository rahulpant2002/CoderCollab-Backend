const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

//Push the data of a User
app.post('/signup', async(req, res)=>{
    const userData = req.body;
    const user = new User(userData);
    try{
        await user.save();
        res.send('User added Successfully...');
    }
    catch(err) {
        res.status(400).send('Error in Adding User!!! ' + err.message);
    }
});

//Delete a User
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

//Update the Info of a User
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




