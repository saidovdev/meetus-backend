import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import authGoogle from "./routes/auth.js";
import './utils/passport.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use(session({
  secret:'cyberwolve',
  resave:false,
  saveUninitialized:false,
  cookie:{ secure:false, maxAge:365*24*60*60*1000 }
}));

const allowedOrigins = [
  "http://localhost:5173",
  "https://47aeb20177e0.ngrok-free.app",
   "https://meetus-server-production.up.railway.app",
];

app.use(cors({
  origin: function(origin, callback) {
    console.log(origin);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, origin); // ✅ aniq originni qo‘yayapmiz
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));


app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

import registerMeetUsUser from './routes/registerMeetUsUser.js';
import helpCenter from './routes/helpCenter.js';
import userProfile from './routes/userProfile.js';
import userInformation from './GetData/userInformation.js';
import tokenRoutes from './routes/tokenRoutes.js';
import linkRoute from './routes/linkRoute.js';
import resume from './routes/resume.js'
app.use('/api/', registerMeetUsUser);
app.use('/api/meetus/help', helpCenter);
app.use('/api/profile', userProfile);
app.use('/api/get-info', userInformation);
app.use('/api/token', tokenRoutes);
app.use('/api/user', linkRoute);
app.use('/api/auth', authGoogle);

app.use('/reusme',resume)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb ulandi"))
  .catch((err) => console.log("Mongo hatolik", err));

const PORT = process.env.PORT || 1747;
app.listen(PORT,  ()=>console.log(`Server ${PORT} da ishlayapti`));
