const router = require('express').Router();
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const { authorize } = require("../middleware/authMiddleware");

const { fetchMessages, sendNewMessage } = require("../controllers/messageControllers");

router.route('/').post(authorize, sendNewMessage);
router.route('/').get(authorize, fetchMessages);

module.exports = router 