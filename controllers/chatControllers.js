const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const createChat = async (req,res) =>{
    const otherUser = req.body;
    let chatExists = await Chat.find({
            isGroup: false ,
            $and: [
                { users : { $elemMatch: { $eq: req.user._id } }},
                { users : { $elemMatch: { $eq: otherUser.id } }}
            ]
    }).populate("users", "-password")
    .populate("latestMessage");

    chatExists= await User.populate(chatExists, {
        path: "latestMessage.sender",
        select: "username email profilepic"
    })

    if(chatExists.length >0){
        res.status(202).send(chatExists[0]);
        console.log("Chat revived");
    }
    else{
        try {
            var newChat = new Chat({
                chatName: "ABC",
                isGroup: false,
                users: [req.user._id , otherUser.id],
            });
            var newlySavedChat = await newChat.save();
            const populatedSavedChat = await newlySavedChat.populate("users","-password");
            res.status(200).send(populatedSavedChat);
            console.log("New chat created");
        } catch (err) {
            console.log(err);
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

const deleteChat = async(req,res) =>{
    try {
        // const toBeDeletedChatID = req.body.ChatID;
        const toBeDeletedChatID = req.params.ChatID;
        const deletedChat = await Chat.findOneAndDelete({_id: toBeDeletedChatID});
        const deletedChats = await Message.deleteMany({ chat: toBeDeletedChatID });
        res.status(200).json(deletedChats);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

}


module.exports = { createChat, fetchUserChats, deleteChat}; 