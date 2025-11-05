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

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,               
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// ES module bilan ishlaydigan routerlar
import registerMeetUsUser from './routes/registerMeetUsUser.js';
import helpCenter from './routes/helpCenter.js';
import userProfile from './routes/userProfile.js';
import userInformation from './GetData/userInformation.js';
import tokenRoutes from './routes/tokenRoutes.js';
import linkRoute from './routes/linkRoute.js';

app.use('/api/', registerMeetUsUser);
app.use('/api/meetus/help', helpCenter);
app.use('/api/profile', userProfile);
app.use('/api/get-info', userInformation);
app.use('/api/token', tokenRoutes);
app.use('/api/user', linkRoute);
app.use('/api/auth', authGoogle);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb ulandi"))
  .catch((err) => console.log("Mongo hatolik", err));

const PORT = process.env.PORT || 1747;
app.listen(PORT,()=>console.log(`Server ${PORT} da ishlayapti`));
