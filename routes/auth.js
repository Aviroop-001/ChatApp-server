const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateJWT = require("../config/generateJWT");

router.post('/register', async (req,res)=>{
    try {
        const hashedPassword= await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            profilepic : req.body.profilepic,
        });
        //Checking if same Username/Email already exists or not
        const foundDoc = await User.findOne({ username: req.body.username, email:req.body.email });
        if(foundDoc){
            res.status(400).json("User Credentials already in use");
        }
        else{
            //if not, we save the new user
            const savedUser = await newUser.save();
            res.status(200).json({
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                profilepic: savedUser.profilepic,
                token: generateJWT(savedUser._id),
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req,res)=>{
    try {
        const currUsername = req.body.username;
        const currPassword = req.body.password;
        const foundDoc = await User.findOne({ username: currUsername });
        if(foundDoc){
            const isValid = await bcrypt.compare(currPassword, foundDoc.password);
            if(isValid){
                res.status(200).json({
                    _id: foundDoc._id,
                    username: foundDoc.username,
                    email: foundDoc.email,
                    profilepic: foundDoc.profilepic,
                    token: generateJWT(foundDoc._id)
                });
            }
            else{
                res.status(400).json("Wrong Password");
            }
        }
        else{
            res.status(400).json("User Not Found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
    
})

module.exports = router