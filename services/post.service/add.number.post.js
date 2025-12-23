import User from "../../models/User.js";
import Post from "../../models/Post.js";
export const add_number_post=async(userId,postId)=>{
    try {
        const user=await User.findById(userId)
        if(!user) return "User not found"
        const post=await Post.findById(postId)


        if(!post) return "Post not found"

        if(user.posts.includes(post._id)) return null
        user.posts.push(postId)
      await user.save()
    } catch (error) {
       console.log("Error ocured while adding number of post",error);
       return "Internal server error"   
     
    }
}
