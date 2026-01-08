// const PrismaClient = require('@prisma/client');
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

// Register Users
// /api/register

export const regUser = async (req,res,next) => {
    console.log(`Incoming req for new user`);

    const {username,password,email,mobNo,dob} = req.body;

    if(!username||!password||!email||!mobNo||!dob){
        return res.status(400).json({sucess: false, msg:'All fields are required'})
    }
    
    try{
        const post = await prisma.post.create({
            data:{username,password,email,mobNo,dob}
        })
        response.status(201).json(post);

    }catch(error){
        response.status(500).json(error)
    }
    
}