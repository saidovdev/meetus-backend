import Notification from "../../models/Notification.js";
import User from '../../models/User.js'

export const get_notification_unread=async({userId})=>{
    try {
        
        const notificationUnread=await Notification.find({to:userId,read:false}).populate("from","profileImgUrl fullname username").sort({createdAt:-1})
        if(!notificationUnread){
            return {warning:"You don't have any unread notification"}
        }


        return {success:"Unread notification's sended",notification:notificationUnread,count:notificationUnread.length}
    } catch (error) {
        console.log("Error ocured while get unread notification",error);
        return {error:'Internal server error'}
    }
}

export const get_all_notifiction=async({userId})=>{
    try {
        const notificationAll=await Notification.find({to:userId}).populate("from","profileImgUrl fullname username").sort({createdAt:-1}).limit(50)

           if(!notificationAll){
            return {warning:"You don't have any  notification"}
        }
        return {success:" Notification's sended",notification:notificationAll,count:notificationAll.length}

    
    } catch (error) {
        console.log("Error ocured while get_all_notification",error);
        return {error:'Internal server error'}
        
    }
}

export const update_allUnread_Notification = async ({ userId, notificationIds }) => {
  try {
    if (notificationIds.notificationIds) {
      notificationIds = notificationIds.notificationIds;
    }

    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        to: userId,
        read: false,
      },
      { $set: { read: true } }
    );
  } catch (error) {
    console.log(error);
    return "Internal server error";
  }
};



