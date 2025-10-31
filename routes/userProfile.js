const express = require("express");    
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../config/cloudinary.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const authenticateToken = require("../middleware/authenticateToken");
const { body, validationResult } = require("express-validator");
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id)
}
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_imgs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

const parser = multer({ storage: storage })

router.use(authenticateToken)


router.post('/add-profile-img', parser.single('image'), async (req, res) => {
    const userId = req.user.id
    const imageUrl = req.file.path
    const publicId = req.file.filename
    if (!isValidObjectId(userId) || !userId) {
        return res.status(400).json({ warning: "User id undefined" })
    }
    if (!imageUrl) {
        return res.status(400).json({ warning: 'All fields are required' })
    }

    try {


        const user = await User.findById(userId)

        if (!user) return res.status(404).json({ warning: "User not found" })

        if (user.profileImgPublicId) {

            await cloudinary.uploader.destroy(user.profileImgPublicId)
        }

        user.profileImgUrl = imageUrl
        user.profileImgPublicId = publicId

        await user.save()

        res.status(201).json({
            succes: 'User profile image updated',
            user

        })
    } catch (error) {
        console.log("Error while updating profile img  ", error.message);
        res.status(500).json({ error: 'Server error' })
    }
})


router.post('/cover-img', parser.single('image'), async (req, res) => {
    const userId = req.user.id
    const { coverImgPublicId, coverImgUrl } = req.body
    if (!isValidObjectId(userId) || !userId) return res.status(400).json({ warning: 'User id is undefined' })
    if (!coverImgUrl) return res.status(400).json({ warning: 'All fields required' })
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ warning: 'User not found ' })
        if (user.coverImgPublicId) {
            await cloudinary.uploader.destroy(user.coverImgPublicId)
        }
        user.coverImgUrl = coverImgUrl
        user.coverImgPublicId = coverImgPublicId
        user.save()
        return res.status(201).json({ success: 'Profile cover img updated ' })

    } catch (error) {
        console.log("Error on uploading cover img", error);
        return res.status(500).json({ error: 'Server error' })
    }
})


router.post('/delete/coverImg', async (req, res) => {
    const userId = req.user.id
    const { coverImgPublicId } = req.body
    if (!isValidObjectId(userId) || !userId) return res.status(400).json({ warning: 'User id undefined' })
    if (!coverImgPublicId) res.status(400).json({ warning: 'All fiels required' })
    try {
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ waring: 'User not found' })
        if (coverImgPublicId === user.coverImgPublicId) {
            await cloudinary.uploader.destroy(coverImgPublicId)
            user.coverImgPublicId = ''
            user.coverImgUrl = ''

        } else {
            return res.status(400).json({ warning: "profile img id is not equal to user's id " })
        }
        user.save()
        return res.status(201).json({ sucess: 'Profile img succesfully deleteds' })

    } catch (error) {
        console.log("Error while deleting cover img", error.message);
        res.status(500).json({ error: 'Server hatosi' })

    }
})


router.post('/:id/delete/img', async (req, res) => {
    const id = req.user.id

    const { profileImgPublicId } = req.body

    if (!isValidObjectId(id) || !id) return res.status(400).json({ warning: 'Id is not defind or invalid' })

    if (!profileImgPublicId) return res.status(400).json({ warning: 'profile img public id is not defined ' })
    try {
        const user = await User.findById(id)

        if (!user) return res.status(404).json({ warning: 'User not  found' })

        if (!user.profileImgPublicId) return res.status(404).json({ warning: 'You don\'t have a profile' })

        if (profileImgPublicId === user.profileImgPublicId) {

            await cloudinary.uploader.destroy(profileImgPublicId)

            user.profileImgUrl = ''

            user.profileImgPublicId = ''
        } else {
            return res.status(400).json({ warning: "profile img id is not equal to user's id " })
        }

        await user.save()

        res.status(200).json({ success: 'Profile img succesfully deleted', user })

    } catch (error) {
        console.log("Error while deleting  img", error.message);
        res.status(500).json({ error: 'Server error' })
    }
})

router.put('/edit', async (req, res) => {
    const { username, bio, fullname, location, gender, birthdate } = req.body
    try {

        if (!isValidObjectId(req.user.id)) return res.status(400).json({ warning: "id is not defind or invalid" })

        const currentUser = await User.findById(req.user.id)

        if (!currentUser) return res.status(404).json({ warning: 'User not found' })

        const updateFields = {}

        if (username && username !== currentUser.username) {
            updateFields.username = username;
            const existing = await User.findOne({ username })
            if (existing) return res.status(400).json({ warning: 'Username alrready taken' })
        }

        if (bio !== currentUser.bio) updateFields.bio = bio
        if (fullname !== currentUser.fullname) updateFields.fullname = fullname
        if (location !== currentUser.location) updateFields.location = location


        if (gender !== currentUser.gender) updateFields.gender = gender
        if (birthdate !== currentUser.birthdate) updateFields.birthdate = birthdate

        if (Object.keys(updateFields).length === 0) return res.status(200).json({ warning: 'Any data updated' })




        await User.findByIdAndUpdate(req.user.id, updateFields, { new: true })
        res.status(200).json({ succes: "Updated succesfully",})

    } catch (error) {
        console.log("Error while updating profile ", error.message);
        res.status(500).json({ error: 'Server error' })
    }
})

// router.put('/:id/category', async (req, res) => {
//     try {
//         const {  roleName, roleKey } = req.body;

//         if (!isValidObjectId(req.params.id)) {

//             return res.status(400).json({ warning: "id is not defined or invalid" });
//         }

//         const currentUser = await User.findById(req.params.id);
//         if (!currentUser) {
//             return res.status(404).json({ warning: 'User not found' });
//         }

//         const updateFields = {
//             role: {
//                 name: roleName ?? currentUser.role.name,
//                 visible: roleVisible ?? currentUser.role.visible,
//                 key: roleKey ?? currentUser.role.key,
//             }
//         };

//         if (
//             updateFields.role.name === currentUser.role.name &&
//             updateFields.role.visible === currentUser.role.visible &&
//             updateFields.role.key === currentUser.role.key
//         ) {
//             return res.status(200).json({ warning: 'Any data updated' });
//         }

//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             updateFields,
//             { new: true }
//         );

//         res.status(200).json({
//             success: "Updated successfully",
//             user: updatedUser
//         });

//     } catch (error) {
//         console.log("Error while updating profile category ", error.message);
//         res.status(500).json({ error: 'Server error' })
//     }
// });



module.exports = router
