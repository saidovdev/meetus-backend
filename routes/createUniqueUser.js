const express=require("express")
const router=express.Router()
const UniqueUser=require("../models/UniqueUser")
const { interNewUser, createUniqueUser } = require("../controllers/CreateNewDeviceUser")
router.post('/create/uniqueUser',createUniqueUser)
router.post('/inter/newUser/:uniqueId',interNewUser)
module.exports=router