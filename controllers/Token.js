
  const User=require('../models/User.js')
const jwt = require("jsonwebtoken");
const mongoose=require('mongoose')
const isValidObjectId=(id)=>{
    return  mongoose.Types.ObjectId.isValid(id)
}

module.exports.sendNewToken=async(req,res)=>{
    try{
        const id=req.params.id
     if(!isValidObjectId(id) ) return res.status(400).json({message:"id is not defind or isvalid"})
        const { refreshToken }=req.body 
       if(!refreshToken) return res.status(403).json({message:"Referesh token yuq yoki iskirgan"})
       const user =await User.findById(id)
       if(!user) return res.status(404).json({message:"User topilmadi"})
jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,user)=>{
    if(err) return res.status(403).json({message:'Refresh token iskirgan'})
        const accessToken=jwt.sign(
    {
id:user.id,username:user.username
    },
    process.env.JWT_SECRET,
    {'expiresIn':'1d'}
)
res.json({accessToken})
})

    }catch(err){
        res.status(500).json({message:"Server error",err})
    }
}