import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import http from 'http'
import { Server } from "socket.io";

import authGoogle from "./routes/auth.js";
import "./utils/passport.js";
import cors from "cors";

import registerMeetUsUser from "./routes/registerMeetUsUser.js";
import helpCenter from "./routes/helpCenter.js";
import userProfile from "./routes/userProfile.js";
import userInformation from "./GetData/userInformation.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import linkRoute from "./routes/linkRoute.js";
import resume from "./routes/resume.js";
import post_project from "./routes/post_project.js";
import collaborators from "./routes/collaborators.routes/collaborators.js";
import searchEngine from "./routes/search.engine/search.engine.js";
import get_post_routes from './routes/post.routes/get.post.routes.js'
import { socketHandler } from "./controllers/user/get.online.user.js";
import notificationRoutes from './routes/notification/notificationRoutes.js'
dotenv.config();
const app = express();

const server=http.createServer(app)
 export const io =new Server(server,{
  cors:{
    origin:'http://localhost:5173',
    credentials:true
  }
 })
 socketHandler(io)






app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  session({
    secret: "cyberwolve",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/", registerMeetUsUser);
app.use("/api/meetus/help", helpCenter);
app.use("/api/profile", userProfile);
app.use("/api/get-info", userInformation);
app.use("/api/token", tokenRoutes);
app.use("/api/user", linkRoute);
app.use("/api/auth", authGoogle);
app.use("/api/resume", resume);
app.use("/api/posts", post_project);
app.use("/api/collaborators", collaborators);
app.use("/api/search", searchEngine);
app.use("/api/get_post",get_post_routes)
app.use('/api/notification',notificationRoutes)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDb Connected"))
  .catch((err) => console.log("Error in mongongoDB", err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  }
});

const PORT = process.env.PORT || 1747;
server.listen(PORT, () => console.log(` Server running under port  ${PORT} `));
