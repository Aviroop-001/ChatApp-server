const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("Message", MessageSchema);