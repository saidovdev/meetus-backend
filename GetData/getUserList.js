const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.post('/:role', async (req, res) => {
    try {
        const role=req.params.role
        const {usersIdArray} = req.body;
        if (!usersIdArray || !Array.isArray(usersIdArray)) {
            return res.status(400).json({ message: "Invalid or missing usersIdArray in request body" });
        }
        
        if(role =="isAdmin") return res.status(403).json({message:"List yuborildi",usersArray:await User.find().select('-password  -createdAt -updatedAt -isAdmin  ')})
        const users = await User.find({ _id: { $in: usersIdArray } }).select('-password -email -createdAt -updatedAt -isAdmin -followers -followings -role');
       if(!users) return res.status(404).json({message:"Users not found"})
        res.json({ message: "Users list", users });
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Server Hatosi",error})
    }
})
module.exports = router;