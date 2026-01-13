const bcrypt = require('bcrypt')

// const PrismaClient = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
        
        const hashedPass = bcrypt.hash(password,10)
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

module.exports = {regUser};