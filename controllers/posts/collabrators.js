import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Calloborators from "../../models/Calloborators.js";
import { add_number_post } from "../../services/post.service/add.number.post.js";
import { io } from "../../index.js";
import { save_notification } from "../../services/notification/save.notification.js";


export const rejectPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rejected, collaboratorId } = req.body;
    const collaborators = await Calloborators.findById(collaboratorId);
    if (!collaborators) {
      return res.status(404).json({ warning: "collaborators posts not found" });
    }

    if (userId !== collaborators.collaboratorId)
      return res.status(401).json({ warning: "it is not your collaborator" });

    collaborators.rejected = rejected;
    await collaborators.save();
    return res.status(200).json({ success: "Rejected successfully" });
  } catch (error) {
    console.log("Error ocured while rejecting post", error);
    return res.status(500).json({ success: "Internal server Error" });
  }
};

export const acceptPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const collaboratorId = req.params.id;
    const postId = req.params.postId;
    const { accepted } = req.body;

    const collaborators = await Calloborators.findOne({collaboratorId,postId});
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ warning: " post not found" });
    }

    if (!collaborators) {
      return res.status(404).json({ warning: "collaborators posts not found" });
    }
    if (userId.toString() !== collaborators.collaboratorId.toString()) {
      console.log(collaborators.collaboratorId.toString(), userId.toString());
      return res.status(401).json({ warning: "it is not your collaborator" });
    }

    const collaborator = post?.collaborators.find(
      (user) => user.userId == userId
    );

    collaborator.accepted = true;

    collaborators.accepted = true;

    await post.save();
    await collaborators.save();
    
   
    const add=await add_number_post(userId,postId)
    if(add){
      return res.status(201).json({ success: "Accepted successfully but cannot add the post to post list" });
    }


 

    const notification= await save_notification({
      senderId:userId,
      receiverId:collaborators.ownerId,
      text:"User accepted you invitation to collaborator",
      messageId:null,notificationType:'collaborator',
      postId:postId
    })



    io.to(collaborators.ownerId.toString()).emit("notification",{
      notification
    })
  
    return res.status(200).json({ success: "Accepted successfully" });
  } catch (error) {
    console.log("Error ocured while accepting post", error);
    return res.status(500).json({ success: "Internal server Error" });
  }
};

export const delete_collaborator = async (req, res) => {
  try {
    const userId = req.user.id;
    const collaboratorId = req.params.id;
    const postId = req.params.postId;
  } catch (error) {}
};

export const get_collaborator = async (req, res) => {
  try {
    const userId = req.user.id;

    let collaborators = await Calloborators.find({
      collaboratorId: userId,
      rejected: false,
      accepted: false,
    }).populate("ownerId", "fullname profileImgUrl username");

    
    if (collaborators.length === 0) {
      return res.status(200).json({ 
        message: "You don't have any pending collaborator requests" 
      });
    }

    const invalidCollaborator = collaborators.find(
      (c) => c.ownerId._id.toString() === userId.toString()
    );

    const filteredCollaborators = collaborators.filter(
      (c) => c.ownerId._id.toString() !== userId.toString()
    );

   

    if (invalidCollaborator && filteredCollaborators.length > 0) {
      return res.status(200).json({
        message: "Some requests are invalid (you can't collaborate with yourself)",
        collaborators: filteredCollaborators
      });
    }

    if (invalidCollaborator && filteredCollaborators.length === 0) {
      return res.status(200).json({
        message: "No valid collaborator requests (invalid self-invite detected)",
        collaborators: []
      });
    }
console.log(collaborators);

    return res.status(200).json({
      message: "Here are your pending collaborator requests",
      collaborators: collaborators
    });

  } catch (error) {
    console.error("Error occurred while getting collaborator:", error);
    return res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};
