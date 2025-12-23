import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
export const save_notification = async ({
  senderId,
  receiverId,
  text,
  messageId = null,
  postId = null,
  notificationType,
}) => {
  try {

       const sender=await User.findById(senderId).select("username fullname profileImgUrl _id")
       if(!sender) return 

    const notification = await Notification.create({
      from: sender,
      to: receiverId,
      text,
      messageId,
      postId,
      notificationType,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification", error);
    throw error;
  }
};
