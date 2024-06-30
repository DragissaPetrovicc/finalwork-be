const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const Cars = require("../models/CarModel");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const FavoriteSearchModel = require("../models/FavoriteSearchesModel");

const router = express.Router();

router.post("/:id", roleMiddleware("USER"), async (req, res) => {
    const userId = req.params.id;
    const { carIds } = req.body;
  
    try {
      if (!userId) return res.status(400).send("Couldn't find user");
  
      const users = await User.find();
      const carDealer = await CarDealerUser.find();
      const allUsers = [...users, ...carDealer];
  
      const foundUser = allUsers.find(u => userId === u.id);
      if (!foundUser) return res.status(400).send("User doesn't exist");
  
      const cars = await Cars.find({ _id: { $in: carIds } });
        if (!cars || cars.length === 0) return res.status(400).send("One or more cars don't exist");

        
        const favoriteCar = await FavoriteSearchModel.create({
            owner: foundUser._id,
            carList: cars 
        });
      if (!favoriteCar) return res.status(400).send("Unable to create favorite car");
  
      return res.send("New favorite search was created successfully");
    } catch (e) {
      return res.status(400).send(e?.message || "Something went wrong");
    }
  });
  

router.get("/:id",roleMiddleware("USER"),async(req,res)=>{
    const userId = req.params.id;
    try{

        if(!userId) return res.status(400).send("Couldn't find user");

        const favoriteSearch = await FavoriteSearchModel.find({ owner: userId }).populate("owner");        
        
        if(!favoriteSearch) return res.status(400).send("This user doesn't have favorite searches");

        return res.status(200).send(favoriteSearch);

    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }
    
});

router.delete("/:id",roleMiddleware("USER"),async(req,res)=>{
  const userId = req.params.id;
  const {favSearch} = req.body;
  try{
    if(!userId) res.status(400).send("Couldn't find user");

      if(!favSearch) return res.status(400).send("Couldn't find favorite search");

      const favoriteSearch = await FavoriteSearchModel.findByIdAndDelete(favSearch);        
      
      if(!favoriteSearch) return res.status(400).send("This search could not be deleted");

      return res.status(200).send("Favorite search successfully deleted");

  }catch(e){
      return res.status(400).send(e?.message || "Something went wrong");
  }
  
});

router.get("/carList/:id", roleMiddleware("USER"), async (req, res) => {
  const favoriteSearchId = req.params.id;
  
  try {
      if (!favoriteSearchId) return res.status(400).send("Couldn't find favorite search ID");
      
      const favoriteSearch = await FavoriteSearchModel.findById(favoriteSearchId).populate("carList");
      if (!favoriteSearch) return res.status(400).send("Favorite search doesn't exist");
      
      const cars = favoriteSearch.carList;
      if (!cars) return res.status(400).send("No cars found for this favorite search");

      return res.status(200).send(cars);
  } catch (e) {
      return res.status(400).send(e?.message || "Something went wrong");
  }
});

module.exports = router;