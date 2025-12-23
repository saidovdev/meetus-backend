import mongoose from "mongoose";


const NotificationSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
    text: String,
    notificationType: {
      type: String,
      enum: ["collaborator", "message", "like-coment-share", "follow-unfollow"],
      required: true,
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "userposts" },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "messages" },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

 export default mongoose.model('notification',NotificationSchema)