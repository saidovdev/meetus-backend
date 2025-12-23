import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import { get_notification_unread,get_all_notifiction,update_allUnread_Notification } from "../../services/notification/get.notification.service.js";
export const get_notificationUnread=async(req,res)=>{
    try {
        const userId=req.user.id

        const unread=await get_notification_unread({userId})
        if(unread.warning) return res.status(304).json(unread.warning)
        if(unread.error) return res.status(500).json(unread.error)
         
         return  res.status(200).json(unread)

    } catch (error) {
        console.log("Error ocured while sending notification",error);
        return res.status(500).json({error:'Internal server error'})
        
    }
}

export const get_allNotification=async(req,res)=>{
     try {
        const userId=req.user.id

        const unread=await get_all_notifiction({userId})
        if(unread.warning) return res.status(304).json(unread.warning)
        if(unread.error) return res.status(500).json(unread.error)
         
         return  res.status(200).json(unread)

    } catch (error) {
        console.log("Error ocured while sending notification",error);
        return res.status(500).json({error:'Internal server error'})
        
    }
}


export const update_allUnreadNotification=async(req,res)=>{
    try {
        const notificationIds=req.body
        const userId=req.user.id
        console.log(userId);
        

        if(notificationIds.length==0) return res.status(400).json({warning:"No unread notification ids"})

            const result=await update_allUnread_Notification({userId,notificationIds})
            if(result){
                console.log(result);
                
                return res.status(500).json({error:'Internal server error'})
            }
            return res.status(200).json({success:'Marked as read'})

    } catch (error) {
        console.log(error);
        
                return res.status(500).json({error:'Internal server error'})
        
    }
}
