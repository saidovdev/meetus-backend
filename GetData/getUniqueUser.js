const express = require('express');
const router = express.Router();
const UniqueUser = require('../models/UniqueUser');

router.get('/:uniqueId', async (req, res) => {
    try {
        const uniqueUser = await UniqueUser.findOne({ uniqueId: req.params.uniqueId });
        if (!uniqueUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: "Data sent successfully", data: uniqueUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;