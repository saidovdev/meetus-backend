const mongoose=require("mongoose")
const MeetUsHelpCenterSchema = new mongoose.Schema({
    email:{type:String},
    username_1:{type:String,required:true},
    whatsHappen:{type:String},
})
module.exports= mongoose.model('MeetUsHelpCenterzaybal',MeetUsHelpCenterSchema)