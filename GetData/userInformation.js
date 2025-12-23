const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userInfo = await User.findById(userId).select("-password");
    if (!userInfo)
      return res.status(404).json({ message: "User va malumotlari topilmadi" });
    res.json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Hatosi", err });
  }
});
module.exports = router;
