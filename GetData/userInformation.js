const express=require("express")
const router=express.Router()
const User=require('../models/User')
// const authenticateToken=require("../middleware/authenticateToken")

router.get('/:id/:role',async(req,res)=>{
    try{
        const userId =req.params.id
        const role=req.params.role
        const userInfo=await User.findById(userId)
        if (role == "isAdmin") return res.json(userInfo) 
        if(!userInfo) return res.status(404).json({message:"User va malumotlari topilmadi"})
       res.json(userInfo) 
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server Hatosi",err})

    }
})
module.exports=router