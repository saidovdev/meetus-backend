const mongoose = require("mongoose");
const MeetUsUserSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    idUser: { type: String },
    email: { type: String },
    isonline:{type:Boolean,default:false},
    lastSeen:{type:Date},
    username: { type: String },
    password: { type: String },
    profileImgPublicId: { type: String },
    coverImgPublicId: { type: String },
    profileImgUrl: { type: String, default: "" },
    coverImgUrl: { type: String, default: "" },
    resume: { type: String, default: "" },
    resumeId: { type: String },
    code: { type: String },
    location: { type: String },
    bio: { type: String },
    role: { type: String, required: true, default: "user" },
    socialLinks: {
      instagram: { type: String },
      telegram: { type: String },
      phone: { type: String },
      whatsApp: { type: String },
      email: { type: String },
    },
    website: [
      {
        link: { type: String },
        name: { type: String },
      },
    ],
    userJob: { type: String, required: false },
    gender: { type: String },
    birthdate: { type: String },
    views: [
      {
        seenBy: { type: mongoose.Schema.Types.ObjectId, ref: "jobusers" },
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobusers" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "jobusers" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserPosts" }],
    vacancy: [{ type: mongoose.Schema.Types.ObjectId, ref: "vacancy" }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("jobusers", MeetUsUserSchema);
