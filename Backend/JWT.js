const { verify, sign} = require("jsonwebtoken")

const createToken = (user) => {
    const accessToken = sign({username: user.username, id:user.id}, process.env.secretKey);

    return accessToken;
};


module.exports = {createToken};