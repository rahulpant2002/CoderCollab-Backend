const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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




