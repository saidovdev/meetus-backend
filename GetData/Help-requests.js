const express=require("express")
const router=express.Router()
const UserSupport=require('../models/HelpSupport')
router.get('/get-requests',async(req,res)=>{
    try{
        const usersAsk=await UserSupport.find()
        res.json(usersAsk)
    }catch(er){
      res.status(500).json({ message: "Server xatolik", error: err.message });
    }
})
module.exports=router