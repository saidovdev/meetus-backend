const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const authenticateUserID =require('../middleware/authenticateUserID.js')
dotenv.config();

const verificationStore = new Map();
const { body, validationResult } = require('express-validator');
router.post("/verify-request", async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "Email yoki username kiritilmagan" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: "Bu username allaqachon bor" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sendVerificationCode = require("../utils/mailer");
    const sent = await sendVerificationCode(email, code);

    if (!sent) return res.status(500).json({ message: "Kod yuborilmadi" });

    verificationStore.set(email, { code, createdAt: Date.now() });
    res.status(200).json({ message: "Kod yuborildi" });

  } catch (err) {
    console.error("Xatolik:", err);
    res.status(500).json({ message: "Ichki server xatosi" });
  }
});


router.post("/register", [
  body("email").isEmail().withMessage("Email notugri")


], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const {  email, username, password, code, role } = req.body;

    if (!username || !password || !code || !email ||!role) {
      return res.status(400).json({ warning: "Barcha maydonlarni to‘ldiring" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) return res.status(409).json({ warning: "Bu username allaqachon olingan" });
    

    const record = verificationStore.get(email);
    if (!record || record.code !== code) {
      return res.status(401).json({ warning: "Kod noto‘g‘ri yoki mavjud emas" });
    }

    if (Date.now() - record.createdAt > 3 * 60 * 1000) {
      return res.status(410).json({ warning: "Kod muddati tugagan" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    verificationStore.delete(email);

    res.status(201).json({ success: "Ro'yxatdan o'tish muvaffaqiyatli" });
  } catch (error) {
    console.log("Error ocured while sign up "+error.message);
    
    res.status(500).json({ error: "Serverda xatolik", error: error.message });
  }
});


router.post("/login", [
  body("username").notEmpty().withMessage("Username kerak"),
  body("password").notEmpty().withMessage("Parol kerak"),
],async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ warning: "Foydalanuvchi topilmadi" });

   const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ warning: "Parol noto'g'ri" });

const accessToken=jwt.sign(
  {
    id:user._id,username:user.username
  },
  process.env.JWT_SECRET,
  {'expiresIn':'365d'}
)
       res.cookie('token',accessToken,{
        httpOnly:true,
        secure:process.env.PROJECT_STATE==="production",
        sameSite:"lax",
        maxAge:365*24*60*60*1000
})

    res.status(200).json({
      success: "Kirish muvaffaqiyatli",
      user
    });
    
  } catch (err) {
   console.log("Error ocured while login account "+err.message)
    res.status(500).json({ error: 'server error' })
  }
});


router.post("/forgot", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ warning: "Username va emailni kiriting" });
    }

    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    if (email !== user.email) {
      return res.status(401).json({ message: "Email noto‘g‘ri" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sendVerificationCode = require("../utils/mailer");

    const sent = await sendVerificationCode(user.email, code);
    if (!sent)
      return res.status(500).json({ message: "Kod yuborilmadi" });

    verificationStore.set(user.email, { code, createdAt: Date.now() });

    return res.status(200).json({ message: "Kod yuborildi" });
  } catch (error) {
    console.error("Error ocured while forgot-route:", error.message);
    res
      .status(500)
      .json({ error: "Serverda xatolik yuz berdi, keyinroq urinib ko‘ring" });
  }
});

router.post("/forgot_password", async (req, res) => {
  const { email, code, username } = req.body;
try {
  
  if (!email || !code || !username) {
    return res.status(400).json({ message: "Email, kod va username kiriting" });
  }

  const record = verificationStore.get(email);
  if (!record || record.code !== code) {
    return res.status(401).json({ message: "Kod noto‘g‘ri yoki mavjud emas" });
  }

  if (Date.now() - record.createdAt > 10 * 60 * 1000) {
    return res.status(410).json({ message: "Kodning amal qilish vaqti tugagan" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });


    res.cookie('id',user._id,{
    httpOnly:true,
        secure:process.env.PROJECT_STATE==="production",
        sameSite:"lax",
        maxAge:365*24*60*60*1000
     })

  await user.save();


  verificationStore.delete(email);
  return res.redirect(`${process.env.CLIENT_URL}/change_password`).status(200)
} catch (error) {
            console.log("Error ocured while sending verify code to sever"+error.status,error.message);
        res.status(500).json({error:"Sever error"})  
}

});

router.post('/reset_password', async (req, res) => {
  const { username, newPassword } = req.body
 try {
   if (!username || !newPassword) {
    res.status(400).json({ message: "Username yoki yangi  parol yuq" })
    return
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: "Parol kamida 6 ta belgidan iborat bo'lish kerak" })
    return
  }
  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" })

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  user.password = hashedPassword
  await user.save() 

  res.status(201).json({ message: "Parol mufaqatli yangilandi" })
 } catch (error) {
         console.log("Error ocured while sending verify code to sever"+error.status,error.message);
        res.status(500).json({error:"Sever error"})  
 }
})

router.post('/no_password/:id', async (req, res) => {
  const { username } = req.body
  const userId=req.cookies.id
  try {
    if ( !userId || !username) {
    
    res.status(400).json({ message: "id yoki usernmae yuq" })
    return

  }
  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" })

  if (user._id.toString() !== userId) return res.status(400).json({ message: "Id mos emas" })


  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );

res.cookie('token',token,{
    httpOnly:true,
        secure:process.env.PROJECT_STATE==="production",
        sameSite:"lax",
        maxAge:365*24*60*60*1000
})

  res.status(201).json({
    message: "Kerish mo'faqatli",
    user
  })
  } catch (error) {
        console.log("Error ocured while  login without password to sever"+error.status,error.message);
        res.status(500).json({error:"Sever error"})  
  }


})


router.put("/:id", async (req, res) => {
  try {
    const { username, bio, role, fullname, email, location } = req.body;
    const updateFields = { username, bio, role, fullname, email, location };
    const updated = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updated) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    res.status(200).json({
      message: "Foydalanuvchi ma’lumotlari yangilandi",
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
});

module.exports = router;
  