const { verify, sign} = require("jsonwebtoken")

const createToken = (user) => {
    const accessToken = sign({username: user.username, id:user.id}, process.env.secretKey);

    return accessToken;
};

const validateToken = (req,res,next) =>{
    console.log('Request headers cookie:', req.headers.cookie);
    console.log('Cookies received:', req.cookies);
    console.log('Access token:', req.cookies["access-token"]);
    const accessToken = req.cookies["access-token"]
    if(!accessToken)
        return res.status(400).json({error:'User not authenticated'});

    try{
        const validToken = verify(accessToken, process.env.secretKey)
        if(validToken){
            req.authenticated = true
            return next();
        }
        return res.status(400).json({error:'Invalid token'});

    }catch(err){
        return res.status(400).json({error:'Invalid or expired token'});
    }
}


module.exports = {createToken,validateToken};