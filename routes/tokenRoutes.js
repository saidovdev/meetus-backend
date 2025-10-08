 const express=require('express')
const { sendNewToken } = require('../controllers/Token')
const router =express.Router()
const authenticateToken = require('../middleware/authenticateToken')

router.post('/:id',sendNewToken)
module.exports=router