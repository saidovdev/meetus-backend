import express from "express";
import { get_post } from "../../controllers/posts/get.post.js";
import authenticateToken from "../../middleware/authenticateToken.js";
const router=express.Router()

router.use(authenticateToken)

router.get('/post/:id',get_post)
export default router
