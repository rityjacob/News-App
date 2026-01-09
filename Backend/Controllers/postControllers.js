// const PrismaClient = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register Users
// /api/register


const regUser = async (req,res,next) => {
    if (!req.body) {
        return res.status(400).json({ success: false, msg: 'Request body is missing or Content-Type header not set' });
    }
    
    // try {
    //     console.log(`Incoming req for new user`);
    //     console.log("test 1");
    //     const {username,password,email,mobno,dob} = req.body;
    //     console.log("test 2");
    //     console.log(req.body);
    //     return res.status(201).json({ success: true, msg: 'User data received', data: req.body });
    // } catch (error) {
    //     console.error('Controller error:', error);
    //     return res.status(500).json({ msg: error.message });
    // }

    console.log(`Incoming req for new user`);

    const {username,password,email,mobno,dob} = req.body;
    
    if(!username||!password||!email||!mobno||!dob){
        return res.status(400).json({sucess: false, msg:'All fields are required'})
    }
    console.log(req.body);
    
    return res.status(200).json({ success: true, msg: 'User data received', data: req.body });
    

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

module.exports = {regUser};