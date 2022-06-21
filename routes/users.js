const router = require('express').Router();
const User = require("../models/User");
const { authorize } = require("../middleware/authMiddleware");
const { searchUser } = require('../controllers/userControllers');


router.route('/').get(authorize, searchUser);

module.exports = router 