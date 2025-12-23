import Post from "../../models/Post.js";

export const get_post_service=async(postId)=>{
    try {
        const post=await Post.findById(postId).populate("userId","fullname username profileImgUrl")
        if(!post) return {warning:"Post doesn't exist"}
        return {post}
    } catch (error) {
         console.log("Error ocured while get post service",error);
         return {error:"Internal Server error"}         
    }
}