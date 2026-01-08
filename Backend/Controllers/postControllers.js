// const PrismaClient = require('@prisma/client');
import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();

// Register Users
// /api/register

export const regUser = async (req,res,next) => {
    console.log(`Incoming req for new user`);

    const {username,password,email,mobno,dob} = req.body;

    if(!username||!password||!email||!mobno||!dob){
        return res.status(400).json({sucess: false, msg:'All fields are required'})
    }

    console.log(req.body);
    
    
    // try{
    //     const post = await prisma.post.create({
    //         data:{
    //             username,
    //             password,
    //             email,
    //             mobno,
    //             dob: new Date(dob)}
    //     })
    //     res.status(201).json(post);

    // }catch(error){
    //     res.status(500).json(error)
    // }
    
}