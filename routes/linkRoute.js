const express= require('express')
const { postLinks, putLinks, postContact, deleteContact } = require('../controllers/PostLinks')
const router=express.Router()
const authenticateToken=require('../middleware/authenticateToken.js')

router.use(authenticateToken)
router.post('/link',postLinks)
router.put('/:id/put-link',  putLinks)
router.post('/contact',  postContact)
router.post('/contact-delete',  deleteContact)


module.exports=router