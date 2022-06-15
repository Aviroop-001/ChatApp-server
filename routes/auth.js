const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


router.post('/register', async (req,res)=>{
    try {
        const hashedPassword= await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            profilepic : req.body.profilepic,
        });
        await newUser.save();
        res.status(200).json(newUser);
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
                res.status(200).json(foundDoc);
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