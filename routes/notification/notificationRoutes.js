import express from "express";
import authenticateToken from "../../middleware/authenticateToken.js";
import {get_notificationUnread,get_allNotification,update_allUnreadNotification} from '../../controllers/notification/notification.js'
const router=express.Router()

router.use(authenticateToken)

router.get('/get_unread',get_notificationUnread)
router.get('/get_all',get_allNotification)
router.put('/update_unread',update_allUnreadNotification)

export default router