const express = require("express");
const User = require("../models/UserModel");
const {config} = require("dotenv");
const bcrypt = require("bcrypt");
const { roleMiddleware } = require("../middlewares/authMiddleware");

config();

const router = express.Router();

const existingUsernames = [];
const existingPhones = [];
const existingEmails = [];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
const phoneNumberRegex = /^\+[0-9]+$/;



router.patch("/:id",roleMiddleware("USER"), async (req, res) => {
    const userId = req.params.id;
    const {firstName,lastName,username,email,phoneNumber,password,location,image} = req.body;

    if (!firstName && !lastName && !username && !email && !phoneNumber && !password && (!location || (!location.state && !location.city)) && !image) {
        return res.status(400).send("User could not be updated because all fields are empty");
    } 

    try {
    const user = await User.findById(userId); 
    const users = await User.find();

    users.map(user => {
        existingUsernames.push(user.username);
        existingEmails.push(user.email);
        existingPhones.push(user.phoneNumber);
    });

    const foundPasword = user.password;


    if(existingUsernames.includes(username)) return res.status(400).send("This username already exists");
    if(existingEmails.includes(email)) return res.status(400).send("This email already exists");
    if(existingPhones.includes(phoneNumber)) return res.status(400).send("This phone number already exists");
    
      


    const updateData = {};
    if (firstName){

        if(firstName === user.firstName){
            return res.status(400).send("You've entered an existing first name");  
        }else{
            updateData.firstName = firstName;
        }
    } 
    if (lastName){
        if(lastName === user.lastName){
            return res.status(400).send("You've entered an existing last name");  
        }else{
            updateData.lastName = lastName;
        }
    }     
    
    if (username){
        if(username.trim().length < 6) return res.status(400).send("Username must be at least 6 characters long");
        if(username === user.username){
            return res.status(400).send("You've entered an existing username");  
        }else{
            updateData.username = username;
        }
    }    
    
    
    if (email){

        if(!emailRegex.test(email)) return res.status(400).send("Email is not valid (user123@gmail.com)");

        if(email === user.email){
            return res.status(400).send("You've entered an existing email");  
        }else{
            updateData.email = email;
        }
    }     
    if (phoneNumber){

        if(!phoneNumberRegex.test(phoneNumber)) return res.status(400).send("Phone number is not valid (+387 12123123)");

        if(phoneNumber === user.phoneNumber){
            return res.status(400).send("You've entered an existing phone number");  
        }else{
            updateData.phoneNumber = phoneNumber;
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
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) return res.status(400).send("Couldn't update user")

    return res.status(200).send(updatedUser);
        
    } catch(e) {
        return res.status(400).send(e?.message || "Something went wrong");
    }
});

router.delete("/:id",roleMiddleware("USER"),async(req,res) => {
    const userId = req.params.id;
    if(!userId) return res.status(400).send("Couldn't find user")
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user) return res.status(400).send("Couldn't delete user")
        return res.status(200).send("User deleted successfully");    
    }catch(e){
        res.status(400).send(e?.message || "Something went wrong");
    }

});

module.exports = router;