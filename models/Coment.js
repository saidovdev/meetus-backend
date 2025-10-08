const mongoose= require('mongoose')
const ComentSchema=mongoose.Schema({
    postId:{type:String,require:true},
    userId:{type:String,required:true},
    
})