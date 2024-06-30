const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const jwt = require("jsonwebtoken");
const {config} = require("dotenv");
const bcrypt = require("bcrypt");

const router = express.Router();
config();

router.post("/user",async ({body}, res) => {
    try {
        const users = await User.find(); 
        const carDealerUsers = await CarDealerUser.find();
        const allUsers = [...users, ...carDealerUsers];
        const {username,dealershipName,password} = body || {};
        if(!username && !dealershipName) return res.status(400).send("This field is required");
        if(!password) return res.status(400).send("Password is required");

        let foundUser = allUsers.find(user => 
            user.username === username || 
            user.dealershipName === dealershipName
        );

        const foundPassword = foundUser.password;

        const match = await bcrypt.compare(password,foundPassword);
        if(!match) return res.status(400).send("Incorrect password");

        const token = jwt.sign({id:foundUser._id,role:foundUser.role}, process.env.JWT_SECRET);
        return res.send({ token,data:foundUser});

    } catch (e) {
        return res.status(400).send("Username or dealership name is wrong");
    }
});


module.exports = router;