const express= require('express')
const { postLinks, putLinks, postContact, deleteContact } = require('../controllers/PostLinks')
const router=express.Router()
const authenticateToken=require('../middleware/authenticateToken.js')
router.post('/:id/link',postLinks)
router.put('/:id/put/link',  putLinks)
router.post('/:id/contact',  postContact)
router.delete('/:id/contact',  deleteContact)


module.exports=router