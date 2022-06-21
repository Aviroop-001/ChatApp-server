const jwt = require('jsonwebtoken');
const User = require("../models/User");

//The middleware to help authorize current loggedin user
const authorize = async (req,res,next) => {
    let token;
    //req.headers are information we send along with the request...like metaData
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            // JWT Bearer token => Bearer 94739748r47r84g4o8ffbrf3bcb8yzb8.... 
            token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.jwtSecret);
            //We seperate the id and search the user with the id
            req.user = await User.findById(decodedToken.id).select('-password');
            next();
        } catch (err) {
            res.status(400).json("Not Authorized");
        }
    }
    else{
        res.status(400).json("No Token Found");
    }
}

module.exports = {authorize} ;
