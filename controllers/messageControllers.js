const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const fetchMessages = async(req,res) =>{
    try {
        var allMessages = await Message.find({ chat: req.body.chatID }).populate(['chat', 'sender']);
        res.status(201).json(allMessages);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const sendNewMessage = async(req,res) =>{
    try {
        var newMessage = new Message({
            sender: req.user._id,
            chat: req.body.chatID,
            content: req.body.messageContent
        });
        var newlySavedMessage = await newMessage.save();
        newlySavedMessage = await newlySavedMessage.populate(['sender', 'chat']);
        newlySavedMessage = await User.populate( newlySavedMessage, {
            path: "chat.users",
            select: '-password'
        }); //Method to populate a document with the fields to other model references

        await Chat.findByIdAndUpdate(req.body.chatID , {latestMessage: newlySavedMessage});
        res.status(201).json(newlySavedMessage);

    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {fetchMessages, sendNewMessage};