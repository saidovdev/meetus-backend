const User = require("../models/User");
const UserModel = require("../models/User");
const mongoose = require("mongoose");
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.postLinks = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id || !isValidObjectId(id))
      return res
        .status(400)
        .json({ message: "Id is not defined or invalid id" });
    const { link, name } = req.body;
    if (!link) return res.status(400).json({ message: "Link kerak " });

    if (!link.startsWith("https://"))
      return res
        .status(400)
        .json({ message: "Link https bilan boshlanishi kerak" });
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User topilmadi" });
    user.website.push({ name: name ? name : "", link });

    await user.save();
    res.status(200).json({ message: "link saved ", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports.putLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    if (!id || !isValidObjectId(id))
      return res
        .status(400)
        .json({ message: "Id is not defined or invalid id" });

    const { name, link } = req.body;
    if (!userId || !isValidObjectId(userId))
      return res
        .status(400)
        .json({ message: "userId is not defined or invalid userid" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User topilmadi" });
    const url = user.website.id(id);
    if (!url) return res.status(404).json({ message: "Url topilmadi" });
    if (!link) {
      user.website = user.website.filter((i) => i._id.toString() !== id);
      await user.save();
      res.status(200).json({ message: "Url successfully deleted", user });
      return;
    }

    if (link) url.link = link;
    if (name) url.name = name;
    await user.save();
    res.status(200).json({ message: "Url yangilandi", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.postContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { instagram, telegram, phone, whatsApp, email } = req.body;
    if (!userId)
      return res.status(400).json({ message: "User id is undefined" });
    if (!userId || !isValidObjectId(userId))
      return res
        .status(400)
        .json({ message: "userId is not defined or invalid userid" });
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ mesage: "User not exist" });
    let updated = false;
    if (instagram !== user.socialLinks.instagram) {
      user.socialLinks.instagram = instagram;
      updated = true;
    }
    if (telegram !== user.socialLinks.telegram) {
      user.socialLinks.telegram = telegram;
      updated = true;
    }
    if (email !== user.socialLinks.email) {
      user.socialLinks.email = email;
      updated = true;
    }
    if (phone !== user.socialLinks.phone) {
      user.socialLinks.phone = phone;
      updated = true;
    }
    if (whatsApp !== user.socialLinks.whatsApp) {
      user.socialLinks.whatsApp = whatsApp;
      updated = true;
    }
    if (!updated) {
      res
        .status(304)
        .json({
          message: "Nothing to updated or post",
          user,
          instagram,
          telegram,
          email,
          phone,
          whatsApp,
        });
      return;
    }
    await user.save();
    res.status(200).json({ message: "Social links successfully posted", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.deleteContact = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId || !isValidObjectId(userId))
      return res
        .status(400)
        .json({ message: "userId is not defined or invalid userid" });

    const { deleteObject } = req.body;

    if (!userId)
      return res.status(400).json({ message: "UserId is undefined" });
    if (!deleteObject)
      return res.status(400).json({ message: "Delete object is NaN" });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not exist" });

    const validKeys = ["instagram", "telegram", "phone", "whatsApp", "email"];
    if (!validKeys.includes(deleteObject))
      return res
        .status(400)
        .json({
          message: `Message ${deleteObject} is not equal to any contact`,
        });

    user.socialLinks[deleteObject] = "";
    user.markModified("socialLinks");
    await user.save();

    res
      .status(200)
      .json({ message: `${deleteObject} contact successfully deleted`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
