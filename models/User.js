const mongoose = require("mongoose")
const MeetUsUserSchema = new mongoose.Schema({
    fullname: { type: String },
    idUser: { type: String},
    email: { type: String, },
    username: { type: String,  },
    password: { type: String },
    profileImgPublicId: { type: String },
    coverImgPublicId: { type: String },
    profileImgUrl: { type: String, default: '' },
    coverImgUrl: { type: String, default: '' },
    code: { type: String },
    location: { type: String },
    bio: { type: String },
    role: {type:String,required:true,default:'user'},
    socialLinks: {
        instagram: { type: String },
        telegram: { type: String },
        phone: { type: String },
        whatsApp: { type: String },
        email: { type: String }
    },
    website: [
        {
            link: { type: String },
            name: { type: String },
        }

    ],
    gender: { type: String },
    birthdate: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MeetUsUser' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MeetUsUser' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPosts' }]


}, {
    timestamps: true
})
module.exports = mongoose.model('jobusers', MeetUsUserSchema)