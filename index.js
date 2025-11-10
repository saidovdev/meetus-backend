import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from  "url";
import authGoogle from "./routes/auth.js";
import "./utils/passport.js";


import registerMeetUsUser from "./routes/registerMeetUsUser.js";
import helpCenter from "./routes/helpCenter.js";
import userProfile from "./routes/userProfile.js";
import userInformation from "./GetData/userInformation.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import linkRoute from "./routes/linkRoute.js";
import resume from "./routes/resume.js";

dotenv.config();
const app = express();
app.use(express.json());


app.use(
  session({
    secret: "cyberwolve",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // https uchun true
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
app.use("/resume", resume);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDb Connected"))
  .catch((err) => console.log("Error in mongo", err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  }
});


const PORT = process.env.PORT || 1747;
app.listen(PORT, () => console.log(` Server running under port  ${PORT} `));
