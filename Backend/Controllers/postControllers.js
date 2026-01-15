const bcrypt = require('bcrypt')

const { PrismaClient } = require('@prisma/client');
const { post } = require('../Route/route');
const prisma = new PrismaClient();
const {createToken, validateToken} = require('../JWT');
// Register Users
// /api/register


const regUser = async (req,res,next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, msg: 'Request body is missing or Content-Type header not set' });
    }
    console.log(`Incoming req for new user`);

    const {username,password,email,mobno,dob} = req.body;
    
    if(!username||!password||!email||!mobno||!dob){
        return res.status(400).json({sucess: false, msg:'All fields are required'})
    }
    console.log(req.body);
    
    try{
        
        const hashedPass = await bcrypt.hash(password,10)
        const post = await prisma.user.create({
            data:{
                username,
                password : hashedPass,
                email,
                mobno,
                dob: new Date(dob)}
        })
    

        res.status(201).json(post);

    }catch(error){
        console.log(error);
        res.status(500).json({error})
    }
    
}

// api/login
const userLogin = async (req,res)=>{
    if(!req.body){
        return res.status(400).json({success: false, msg:'All fields are required'});
    }

    console.log(`Incoming request for new login`);

    const {username,password} = req.body;

    const user = await prisma.user.findUnique({
        where: {username},
    })
    if (!user) {
        return res.status(400).json({error:'User doesnt exist'})
    };
    

    const dbpassword = user.password
    const match = await bcrypt.compare(password,dbpassword)
    
    if(!match){
        return res.status(400).json({error: "Wrong password"});
    } else{

        accessToken = createToken(user)
        
        res.cookie("access-token", accessToken,{
            maxAge: 60*60
        });

        return res.status(200).json({success: true, msg:'Log in sccess'});
    }
    
    

    
}

// Home page
// /api/homePage

const homePage = async (req,res) =>{
    res.json("Homea Page")
}

module.exports = {regUser, userLogin, homePage};