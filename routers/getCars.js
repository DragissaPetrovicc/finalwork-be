const express = require("express");
const Cars = require("../models/CarModel");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");

const router = express.Router();


router.get("/getCars", async (req, res) => {
    try {
        
        const allCars = await Cars.find().populate("owner");
        if(allCars.lenght === 0){
            return res.status(400).send("There is no cars avaible")
        }else{
            return res.send(allCars);

        }
    } catch (e) {
        return res.status(400).send("Cars fetching failed...");
    }
});

router.get("/getCars/:id", async (req, res) => {

    const userId = req.params.id;

    try {
        
        const cars = await Cars.find({owner:{$in:[userId,Cars.owner]}});
        if(cars.lenght === 0){
            return res.status(400).send("There is no cars avaible")
        }else{
            return res.status(200).send(cars);

        }
    } catch (e) {
        return res.status(400).send("Cars fetching failed...");
    }
});

router.get("/:id",async(req,res)=>{
    const carId = req.params.id;
    if(!carId) return res.status(400).send("Couldn't find car");
try{
    const car = await Cars.findById(carId);
    if(!car) return res.status(400).send("Couldn't find car");

    return res.send(car);
}catch(e){
    return res.status(400).send(e?.message || "Something went wrong,try again");
}

});

router.get("/carOwner/:id",async (req, res) => {

    const ownerId = req.params.id;
    try {

        if(!ownerId) return res.status(400).send("You didn't specify which user you are looking for");

        const users = await User.findById(ownerId); 
        const carDealerUsers = await CarDealerUser.findById(ownerId);

        if(!users){
            if(carDealerUsers){
                res.send(carDealerUsers);
            }else{
                res.status(400).send("User doesn't exist");
            }
        }else{
            return res.status(200).send(users);
        }
    } catch (e) {
        console.error(e)
        return res.status(400).send(e?.message || "Could not find user");
    }
});


module.exports = router;