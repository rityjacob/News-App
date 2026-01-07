// Register Users
// /api/register

export const regUser = (req,res,next) => {
    console.log(`Incoming req for new user`);

    const {username,password,email,mobNo,dob} = req.body;

    if(!username||!password||!email||!mobNo||!dob){
        return res.status(400).json({sucess: false, msg:'All fields are required'})
    }
    
    
}