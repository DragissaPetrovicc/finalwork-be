const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const Cars = require("../models/CarModel");
const ReportArticle = require("../models/ReportArticleModel");

const router = express.Router();

router.post("/:id",roleMiddleware("USER"),async(req,res)=>{
    const userId = req.params.id;
    const {carId,reason,additionalMessage} = req.body;
    try{
        if(!userId) return res.status(400).send("Couldn't find user");
    
        const users = await User.find();
        const carDealer = await CarDealerUser.find();
        const allUsers = [...users,...carDealer];
    
        const foundUser = allUsers.find(u=> userId === u.id); 
        if(!foundUser) return res.status(400).send("User doesn't exist");  

        if(!carId) return res.status(400).send("You didn't specify which car you are reporting");

        const car = await Cars.findById(carId);
        if(!car) return res.status(400).send("Specified car doesn't exist"); 

        if(!reason) return res.status(400).send("Reason is required");

        const repCar = ReportArticle.create({reportedBy:foundUser,reportedArticle:car,reason,additionalMessage});

        if(!repCar) return res.status(400).send("Unable to report car");

        return res.send("Car reported successfully");


    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }});

module.exports = router;