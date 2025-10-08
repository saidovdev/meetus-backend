const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Help= require("../models/HelpSupport");

const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const authenticateToken=require('../middleware/authenticateToken')



router.post('/help-center',async (req, res) => {
  try {
    console.log(req.body);
    const { email, username, whatsHappen } = req.body;
    if (!email || !username || !whatsHappen) {
      return res.status(400).json({ message: "Yordam uchun malumot yetarli emas" });
    }

    const existing = await User.findOne({ username });
    if (!existing) {
      return res.status(404).json({ message: "Bunaqa foydalano'vchi yuq va biz yordam bera olmaymiz" });
    }

    const newRequestForHelp = new Help({
      email,
      username_1: username,
      whatsHappen,
    });

    await newRequestForHelp.save();

    return res.status(201).json({ message: "Surov qabul qilindi, sizning emailingizga 24 soat ichida javob yuboriladi" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server hatosi help center", error: err.message });
  }
});



module.exports=router