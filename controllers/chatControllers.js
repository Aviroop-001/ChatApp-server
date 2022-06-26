const Chat = require("../models/Chat");
const User = require("../models/User");

const createChat = async (req,res) =>{
    const otherUser = req.body;
    let chatExists = await Chat.find({
            isGroup: false ,
            $and: [
                { users : { $elemMatch: { $eq: req.user._id } }},
                { users : { $elemMatch: { $eq: otherUser.id } }}
            ]
    }).populate("users", "-password").populate("latestMessage");
    console.log("first----", chatExists);

    // chatExists= await User.populate(chatExists, {
    //     path: "latestMessage.sender",
    //     select: "username email profilepic"
    // })
    // console.log("second----", chatExists);

    if(chatExists.length >0){
        res.status(202).send(chatExists[0]);
    }
    else{
        try {
            let newChat = new Chat({
                chatName: "ABC",
                isGroup: false,
                users: [req.user._id , otherUser.id],
            });
            const newlySavedChat = await newChat.save();
            const populatedSavedChat = await newlySavedChat.populate("users","-password");
            res.status(201).send(populatedSavedChat);
            console.log("third----", populatedSavedChat);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

const fetchUserChats = async (req,res) =>{
    try {
        let userChats = await Chat.find(
            { users : { $elemMatch: { $eq: req.user._id } }}
        ).populate("users", "-password")
        .populate("latestMessage")
        .populate("admin", "-password")
        .sort({updatedAt: -1})
        res.status(202).send(userChats);
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
}


module.exports = { createChat, fetchUserChats}; 