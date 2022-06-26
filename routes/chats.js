const router = require('express').Router();
const User = require("../models/User");
const Chat = require("../models/Chat");
const { authorize } = require("../middleware/authMiddleware");

const { createChat, fetchUserChats } = require("../controllers/chatControllers");

//The router.route() function returns an instance of a single route that you can then use to handle HTTP verbs with optional middleware.
router.route('/').post(authorize, createChat);
router.route('/').get(authorize, fetchUserChats);

module.exports = router 