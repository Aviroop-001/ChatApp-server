const User = require("../models/User");

const searchUser = async (req,res) =>{
    const queryUsername = req.query.username;
    console.log("Curr",req.user);
    try {
        let foundUser = await User.find(
            { $and:[ 
                { _id: { $ne: req.user._id }}, //not including the user who is searching
                { $or: [ 
                { username: queryUsername },
                { username: { $regex: '^' + queryUsername, $options: 'i' } } 
                                //usernames staring with 'queryUsername'
                ]}
            ]}
        );
        res.status(200).send(foundUser);
    } catch (err) {
        res.status(500).send(err);
    }

}

module.exports = {searchUser};