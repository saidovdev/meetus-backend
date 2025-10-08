const mongoose=require("mongoose")

const UniqueUserSchema=new mongoose.Schema({
    uniqueId:{type:String,required:true,unique:true},
        belowAccounts:[
       {
       userId:{type:String,unique:true},
       password:{type:String},
       
       
       }

     ]
},
{timestamps:true}
)

module.exports=mongoose.model("UniqueUser",UniqueUserSchema)