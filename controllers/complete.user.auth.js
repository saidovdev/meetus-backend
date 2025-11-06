import User from '../models/User.js';
import 'dotenv/config'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

 export const  complete_user_auth=async(req,res)=>{
    try {
        const {username,password,role}=req.body
        const email=req.cookies.email

        console.log(username,password,role,email);
        
        if(!email || !username || !password || !role) return res.status(400).json({success:false,message:"User data is not enougth"})
        
         const user =await User.findOne({email})   
         if(!user){
            return res.status(404).json(
                {
                    succes:false,
                    message:'User not found'
                }
            )
         }

         const userExist= await User.findOne({username})
         if(userExist) return res.status(409).json({success:false,message:'this username is already taken'})
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.username=username;
            user.role=role;
            user.password=hashedPassword;


            await user.save()

const token=jwt.sign(
    {
        id:user._id,
        username,
        role
    },
   process.env.JWT_SECRET,
   {'expiresIn':'365d'}
)


      res.cookie('token',token,{
       httpOnly:true,
        secure:process.env.PROJECT_STATE==="production",
        sameSite:"lax",
        maxAge:365*24*60*60*1000
         })
            res.status(200).json({success:true,message:"User successfully created"})
            
    } catch (error) {
        console.log("Error ocured while completing user info in controller",error.message);
        res.status(500).json({error:"Server error"})
        
    }
}
