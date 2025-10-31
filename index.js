const express = require("express")
const mongoose=require("mongoose")
const cors= require("cors")
const cookieParser =require("cookie-parser")

require("dotenv").config()

 const app=express()
 app.use(express.json()); 

 app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,               
}));

 app.use(cookieParser())




app.use('/api/',require("./routes/registerMeetUsUser"))
app.use('/api/meetus/help',require("./routes/helpCenter"))
app.use('/api/profile',require("./routes/userProfile"))
app.use('/api/get-info',require("./GetData/userInformation"))
app.use('/api/token',require('./routes/tokenRoutes'))
app.use('/api/user',require('./routes/linkRoute.js'))

// app.use('/api/getUserList',require('./GetData/getUserList.js'))
// app.use('/api/uniqueUser',require('./routes/createUniqueUser.js'))
// app.use('/api/getUniqueUser',require('./GetData/getUniqueUser.js'))
 mongoose.connect(process.env.MONGO_URI)
 .then(()=>console.log("Mongodb ulandi"))
 .catch((err)=>console.log("Mongdb hatolik ",err))
 const PORT= process.env.PORT || 1747
 app.listen(PORT,()=>console.log(`Server ${PORT} da ishlayapti`))




