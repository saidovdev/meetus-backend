  const UniqueUser =require("../models/UniqueUser.js")
  // checking unique devices userID before login account to add user list 
  const authenticateUserID =async(req,res,next)=>{
    try {
        
        const userID=req.cookies.uniqueID

        if(!userID) return res.status(400).json({warning:"Invalid credentials"})

        const uniqueUser=await  UniqueUser.findOne({uniqueId:userID})

       if(!uniqueUser) return res.status(404).json({warning:"User not found"})

      next()
 res.status(200).json({success:"User found successfully"})
    } catch (error) {
       console.log("Error ocured  in middleware  while cheking unique id"+error.message);
       res.status(500).json({error:"Internal server error"})
        
    }
}


export default authenticateUserID