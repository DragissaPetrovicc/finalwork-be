const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const RatingModel = require("../models/starRatingModel");

const router = express.Router();

router.post("/:id",roleMiddleware("USER"),async(req,res)=>{

    const userId = req.params.id;
    const {stars} = req.body;

    try{
        if(!userId) return res.status(400).send("Couldn't find user");
        if(!stars) return res.status(400).send("Star raiting is required");

        const users = await User.find();
        const carDealer = await CarDealerUser.find();
        const allUsers = [...users,...carDealer];

        const foundUser = allUsers.find(u=> userId === u.id); 
        if(!foundUser) return res.status(400).send("User doesn't exist");

        const starRating = await RatingModel.create({ratedBy:foundUser,stars});
        if(!starRating) return res.status(400).send("Unable to rate app,try later"); 

        return res.status(200).send("You rated app successfully");

    }catch(e){
        return res.status(400).send(e?.message || "Could not rate app");
    }
});

module.exports = router;