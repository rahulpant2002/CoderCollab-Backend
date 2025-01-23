const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();
const http = require('http');

app.use(cors({
    origin : "http://localhost:5173/",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], 
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userConnectionRouters = require("./routers/userConnection");
const chatRouter = require("./routers/chat")
const initialiseSocket = require('./helper/socket');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userConnectionRouters);
app.use('/', chatRouter);

const server = http.createServer(app);
initialiseSocket(server);

connectDB()
    .then(()=>{
        console.log('Database Connected Successfully...');
        server.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    })
    .catch((err)=>{
        console.error('Database Connection not Stablished!!!');
    })