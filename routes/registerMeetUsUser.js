const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { randomUUID } = require('crypto')
const authenticateUserID =require('../middleware/authenticateUserID.js')
dotenv.config();

const verificationStore = new Map();
const { body, validationResult } = require('express-validator');
const { log } = require("console");
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
  body("username").isLength({ min: 3 }).withMessage("username juda qisqa kupaytirsh kerak"),
  body("password").isLength({ min: 6 }).withMessage("Parol juda oson murakkabroq parol kerak"),
  body("email").isEmail().withMessage("Email notugri")


],authenticateUserID, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { fullname, email, username, password, code, location, bio, role } = req.body;

    if (!username || !password || !code || !email) {
      return res.status(400).json({ warning: "Barcha maydonlarni to‘ldiring" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ warning: "Bu username allaqachon olingan" });

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
      fullname,
      idUser: randomUUID(),
      email,
      username,
      password: hashedPassword,
      location,
      bio,
      role,
      createdAt: new Date(),
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
], authenticateUserID,async (req, res) => {
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
    res.status(200).json({
      success: "Kirish muvaffaqiyatli",
      user
    });
    
  } catch (err) {
   console.log("Error ocured while login account "+err.message)
    res.status(500).json({ error: 'server error' })
  }
});


// router.post('/token', async(req,res)=>{
//   const { refreshToken,id} =req.body
//   if(!refreshToken) return res.status(404).json({message:"Refresh token yuq "})
//   const user= await User.findOne({})
//   if(!user) return res.status(404).json({message:'User yuq'})

//   jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,user)=>{
//     if(err) return res.status(403).json({message:"Refresh token yaroqsiz"})
//     const accessToken=jwt.sign(
//       {
//         id:user.id,username:user.username
//       },
//       process.env.JWT_SECRET,
//       {'expiresIn':'1d'}
//     )
//     res.json({accessToken})
//   })

// })
router.post("/forgot", async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Username va emailni kiriting" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

  if (email !== user.email) {
    return res.status(401).json({ message: "Email noto‘g‘ri" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const sendVerificationCode = require("../utils/mailer");
  const sent = await sendVerificationCode(user.email, code);

  if (!sent) return res.status(500).json({ message: "Kod yuborilmadi" });

  verificationStore.set(user.email, { code, createdAt: Date.now() });
  res.status(200).json({ message: "Kod yuborildi" });
});
router.post("/forgot-password", async (req, res) => {
  const { email, code, username } = req.body;

  if (!email || !code || !username) {
    return res.status(400).json({ message: "Email, kod va yangi parolni kiriting" });
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



  await user.save();


  verificationStore.delete(email);
  res.status(200).json({ message: 'Parol yuborildi', user: user._id })

});

router.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body
  if (!username || !newPassword) {
    res.status(400).json({ message: "Username yoki newPassword yuq" })
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
  user.idUser = randomUUID()

  await user.save()
  console.log(user.idUser);

  res.status(201).json({ message: "Parol mufaqatli yangilandi" })
})

router.post('/no-password', async (req, res) => {
  const { idUser, username } = req.body
  if (!idUser || !username) {
    res.status(401).json({ message: "id yoki usernmae yuq" })
    return

  }
  const user = await User.findOne({ username })
  if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" })

  if (user._id.toString() !== idUser) return res.status(401).json({ message: "Id mos emas" })


  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      username: user.username,
      idUser: user.idUser,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(201).json({
    message: "Kerish mo'faqatli",
    token,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      fullname: user.fullname,
      idUser: user.idUser,
      bio: user.bio,
      createdAt: user.createdAt,
      location: user.location,
      email: user.email,
    }
  })


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
