const jwt = require('jsonwebtoken');

const generateJWT = (id) =>{
    return jwt.sign(
        { id }, process.env.jwtSecret, { expiresIn: "60d" }
      );
}

module.exports = generateJWT ;