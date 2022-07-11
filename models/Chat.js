const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema(
    {
        isGroup:{
            type: Boolean,
            required: true,
        },
        chatName:{
            type: String,
            trim: true,
        },
        users:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        latestMessage:{
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            ref: "Message",
        },
        admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Chat", ChatSchema);