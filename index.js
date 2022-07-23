const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

//Importing Routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const chatRoute = require("./routes/chats");
const messageRoute = require("./routes/messages");

// Configuring the backend
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

//DB connection
mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch( err => {
    console.log(err);
});

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.get('/', (req,res)=>{
    try {
        res.send('Chat Server is running')
    } catch (error) {
        res.status(404).json("Server is DOWN")
    }
})

const server = app.listen(process.env.PORT || 8080, () =>{
    console.log('Backend is up and running...')
});

const io = require('socket.io')(server,{
    pingTimeout: 20000,
    cors:{
        origin: "http://localhost:3000"
    },
});
io.on("connection", (socket) => {
    // console.log(socket.id);
    socket.on("setup", (userData) =>{
        socket.join(userData._id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) =>{
        socket.join(room);
        console.log("Room: "+room);
    });
    socket.on('new message', (newMessage) =>{
        var currentChat = newMessage.chat;

        currentChat.users.forEach(u => {
            if(newMessage.sender._id === u._id)
                return;
                socket.in(u._id).emit('message received', newMessage);
        });
    });
});


