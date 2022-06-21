const router = require('express').Router();
const User = require("../models/User");
const Chat = require("../models/Chat");
const { authorize } = require("../middleware/authMiddleware");

const { createChat, fetchUserChats, createGroupChat } = require("../controllers/chatControllers");

//The router.route() function returns an instance of a single route that you can then use to handle HTTP verbs with optional middleware.

router.route('/').post(authorize, createChat);
// router.route('/').get(authorize, fetchUserChats);
// router.route('/create-group').post(authorize, createGroupChat);
// router.route('/rename-group').put(renameGroupCHat);
// router.route('/add-user-to-group').put(renameGroupCHat);


module.exports = router 