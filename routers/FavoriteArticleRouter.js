const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const Cars = require("../models/CarModel");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const FavoriteArticle = require("../models/FavoriteArticleModel");

const router = express.Router();

router.post("/:id",roleMiddleware("USER"),async(req,res)=>{
    const userId = req.params.id;
    const {carId} = req.body;
    
try{
    if(!userId) return res.status(400).send("Couldn't find user");

    const users = await User.find();
    const carDealer = await CarDealerUser.find();
    const allUsers = [...users,...carDealer];

    const foundUser = allUsers.find(u=> userId === u.id); 
    if(!foundUser) return res.status(400).send("User doesn't exist");  

    const car = await Cars.findById(carId);
    if(!car) return res.status(400).send("Car doesn't exist");  

    const favoriteCar = FavoriteArticle.create({owner:foundUser,car:car});
    if(!favoriteCar) return res.status(400).send("Unable to create favorite car"); 

    res.send("Car added to favorites successfully");
}catch(e){
    return res.status(400).send(e?.message || "Something went wrong");
}

});

router.get("/:id",roleMiddleware("USER"),async(req,res)=>{
    const userId = req.params.id;
    try{

        if(!userId) return res.status(400).send("Couldn't find user");

        const cars = await FavoriteArticle.find({owner:{$in:[userId,FavoriteArticle.owner]}}).populate("owner").populate("car");
        if(cars.length === 0) return res.status(400).send("This user doesn't have favorite cars");

        res.send(cars);

    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }
    
});
module.exports = router;