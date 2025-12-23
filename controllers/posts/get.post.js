import Post from "../../models/Post.js";
import { get_post_service } from "../../services/post.service/get.post.service.js";

export const get_post=async(req,res)=>{
    try {
        const userId=req.user.id
        const postId=req.params.id
        if(!postId) {
            return res.status(400).json({warning:"Bad request"})
        }
        const result=await get_post_service(postId)
        if(result.warning){
            return res.status(400).json({warning:result.warning})

        }
        if(result.error){
            return res.status(500).json({error:result.error})

        }
        return res.status(200).json({success:"Post sent successfully",post:result?.post})
    } catch (error) {
        console.log("Error ocured while getting post ",error);
        res.status(500).json({error:'Internal server error'})
        
    }
}
