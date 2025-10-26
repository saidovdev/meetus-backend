const UniqueUser = require("../models/UniqueUser")
const User = require("../models/User")
const express = require("express")
const { randomUUID } = require('crypto')
const { default: mongoose } = require("mongoose")
require('dotenv').config()
const isValidObjectId = (uid) => {
    return mongoose.Types.ObjectId.isValid(uid)
}

module.exports.createUniqueUser = async (req, res) => {
    try {
        const uniqueId = randomUUID()
        const existingUniqueUser = await UniqueUser.findOne({ uniqueId })
        if (existingUniqueUser) return res.status(409).json({ message: "Unique user already exists" })
        const newUniqueUser = new UniqueUser({ uniqueId })
    res.cookie("uniqueID",uniqueId,{
        httpOnly:true,
        secure:false,
        sameSite:"lax",
        maxAge:365*24*60*60*1000
    })
        await newUniqueUser.save()
        res.status(201).json({ message: "Unique user created", newUniqueUser })

    } catch (error) {
        res.status(500).json({ error: "Server error ", error })
        console.log(error);
        
    }
}

module.exports.interNewUser = async (req, res) => {
    try {
        const uniqueId = req.params.uniqueId
        const { userId, password } = req.body
        if (!uniqueId) return res.status(401).json({ message: "Unique user Id is undefined" })
        if (!userId) return res.status(400).json({ message: "User Id is undefined" })
        if (!isValidObjectId(userId)) return res.status(400).json({ message: "UserId is not valid" })
        const userExists = await User.findById(userId)
        if (!userExists) return res.status(404).json({ message: "User not found" })
        if (!password) return res.status(400).json({ message: "Password is undefined" })
        const uniqueUser = await UniqueUser.findOne({ uniqueId })
        if (!uniqueUser) return res.status(404).json({ message: "Unique user not found" })
        const userIDFilter = uniqueUser.belowAccounts.find(i => i.userId === userId)
        if (userIDFilter) {
            uniqueUser.belowAccounts = uniqueUser.belowAccounts.filter(i => i.userId !== userId)
            uniqueUser.belowAccounts.push({ userId, password })
            await uniqueUser.save()
            return res.status(200).json({ message: "User account updated", uniqueUser })
        }


        uniqueUser.belowAccounts.push({ userId, password })
        await uniqueUser.save()
        res.status(201).json({ message: "User account added", uniqueUser })

    } catch (error) {
        res.status(500).json({ message: "Server error ", error })
    }
}
