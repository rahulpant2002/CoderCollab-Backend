const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin : "https://coder-collab-frontend.vercel.app/",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], 
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userConnectionRouters = require("./routers/userConnection");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userConnectionRouters);

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




