const Chat = require("../models/Chat");
const User = require("../models/User");

const createChat = async (req,res) =>{
    const otherUserid = req.body;
    const chatExists = await Chat.find(
        { $and:[ 
            { isGroup: false },
            { users : { $elemMatch: { _id: req.user._id } }},
            { users : { $elemMatch: { _id: otherUserid } }}
        ]}
    ).populate("users", "-password").populate("latestMessage");

    // chatExists= await User.populate
    if(chatExists.length >0){
        res.status(200).send(chatExists[0]);
    }
    else{
        try {
            let newChat = new Chat({
                chatName: "ABC",
                isGroup: false,
                users: [req.user._id , otherUserid],
            });
            const newlySavedChat = await newChat.save();
            const populatedSavedChat = newlySavedChat.populate("users","-password");
            res.status(200).send(populatedSavedChat);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

const fetchUserChats = async (req,res) =>{

}

const createGroupChat = async (req,res) =>{

}


module.exports = { createChat, fetchUserChats, createGroupChat }; 