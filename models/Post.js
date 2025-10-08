const mongoose =require("mongoose")

const PostSchema=mongoose.Schema({
    userId:{type:String, required:true},
    imageUrl:{type:String},
    vedioUrl:{type:String},
    coverImgUrl:{type:String},
    desc:{type:String},
    likes:{type:[String],default:[]},
    visibility:{type:String ,enum:['public','following','privite'],default:'public'},
    views:{type:Number,default:0},
    location:{type:String},
    tags:{type:[String],default:[]},
    dislikedBy:{type:[String],default:[]},
    spamedBy:[
      {
   spamedUserId:{type:String},
   reason:{type:String},
   createdAt:{type:Date ,default:Date.now}
      }
    ],
    savedBy:{type:[String],default:[]},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}



})

