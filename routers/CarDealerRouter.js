const express = require("express");
const CarDealerUser = require("../models/CarDealerUserModel");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const {config} = require("dotenv");
const { roleMiddleware } = require("../middlewares/authMiddleware");
config();

const router = express.Router();

const existingDealerships = [];
const existingPhones = [];
const existingEmails = [];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
const phoneNumberRegex = /^\+[0-9]+$/;


router.patch("/:id",roleMiddleware("USER"), async (req, res) => {
    const userId = req.params.id;
    const {dealershipName,contact,password,location,image} = req.body;

    if (!dealershipName  && (!contact || (!contact.email && !contact.phoneNumber)) && !password && (!location || (!location.state && !location.city)) && !image) {
        return res.status(400).send("User could not be updated because all fields are empty");
    } 

    try {
    const user = await CarDealerUser.findById(userId); 
    const users = await CarDealerUser.find();

    users.map(user => {
        existingDealerships.push(user.dealershipName);
        if (user.contact) {
            existingEmails.push(user.contact.email);
            existingPhones.push(user.contact.phoneNumber);
        }
    });

    const foundPasword = user.password;


    if (existingDealerships.includes(dealershipName)) return res.status(400).send("This car dealer name already exists");
    if (contact && contact.email && existingEmails.includes(contact.email)) return res.status(400).send("This email already exists");
    if (contact && contact.phoneNumber && existingPhones.includes(contact.phoneNumber)) return res.status(400).send("This phone number already exists");

      


    const updateData = {};
    
    if (dealershipName){
        if(dealershipName === user.dealershipName){
            return res.status(400).send("You've entered an existing Car dealer name");  
        }else{
            updateData.dealershipName = dealershipName;
        }
    }    
    
    
    if (contact) {
        if (contact.email) {
            if (!emailRegex.test(contact.email)) return res.status(400).send("Email is not valid (user123@gmail.com)");

            if (contact.email === user.contact.email) {
                return res.status(400).send("You've entered an existing email");  
            } else {
                updateData.contact = updateData.contact || {};
                updateData.contact.email = contact.email;
            }
        }

        if (contact.phoneNumber) {
            if (!phoneNumberRegex.test(contact.phoneNumber)) return res.status(400).send("Phone number is not valid (+387 12123123)");

            if (contact.phoneNumber === user.contact.phoneNumber) {
                return res.status(400).send("You've entered an existing phone number");  
            } else {
                updateData.contact = updateData.contact || {};
                updateData.contact.phoneNumber = contact.phoneNumber;
            }
        }
    }  
    if (password) {
        if(password.trim().length < 6) return res.status(400).send("Password must be at least 6 characters long");
        const match = await bcrypt.compare(password,foundPasword);
        if(match) {
            return res.status(400).send("You've entered an existing password");  
        }else{
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password,salt);
            req.body.password = hash;
            updateData.password = hash;
        }    
    }

    if (location) {
        if (location.state) {
            if (location.state === user.location.state) {
                return res.status(400).send("You've entered an existing state");  
            } else {
                updateData.location = updateData.location || {};
                updateData.location.state = location.state;
            }
        }
        if (location.city) {
            if (location.city === user.location.city) {
                return res.status(400).send("You've entered an existing city");  
            } else {
                updateData.location = updateData.location || {};
                updateData.location.city = location.city;
            }
        }
    }
    if (image) updateData.image = image;
    const updatedUser = await CarDealerUser.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(400).send("Couldn't update user")

    return res.send(updatedUser);
        
    } catch(e) {
        return res.status(400).send(e?.message || "Something went wrong");
    }
});

router.delete("/:id",roleMiddleware("USER"),async(req,res) => {
    const userId = req.params.id;
    if(!userId) return res.status(400).send("Couldn't find user")
    try{
        const user = await CarDealerUser.findByIdAndDelete(userId);
        if(!user) return res.status(400).send("Couldn't delete user")
        return res.status(200).send("User deleted successfully");    
    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }

});

module.exports = router;