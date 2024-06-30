    const express = require("express");
    const Cars = require("../models/CarModel");
    const User = require("../models/UserModel");
    const CarDealerUser = require("../models/CarDealerUserModel");
    const { roleMiddleware } = require("../middlewares/authMiddleware");

    const router = express.Router();

    router.get("/myCars/:id",roleMiddleware("USER"),async(req,res)=>{
        const userId = req.params.id;
        try{

            if(!userId) return res.status(400).send("Couldn't find user");

            const cars = await Cars.find({owner:{$in:[userId,Cars.owner]}});
            if(cars.length === 0) return res.status(400).send("This user doesn't have any cars");

            return res.send(cars);

        }catch(e){
            return res.status(400).send(e?.message || "Something went wrong");
        }});

    router.post("/addCar",roleMiddleware('USER'),async({body},res) =>{
        try{
            const {owner,price,images,manufactorer,model,fuel,transmission,mileage,cubicasis,enginePower,music,numberOfDoors,
                year,horsePower,drivetrain,numberOfGears,registration,emisionStandard,type,carEquipment:{
                rimSize,alarm,ABS,ESP,turbo,airbag,enterier,parkingCamera,parkingCensors,lights,navigation,
                touchScreen,bluetooth,startStopSystem},description,status,createdAt,views} = body || {};

                const users = await User.find() 
                const carDealerUsers = await CarDealerUser.find();
                const allUsers = [...users, ...carDealerUsers];     
                const userIds = [];
                allUsers.map(u =>{
                    userIds.push(u.id);
                
                });
                
            if(!owner) return res.status(400).send("Car owner is required");
            if(!price) return res.status(400).send("Price is required");
            if(!userIds.includes(owner)) return res.status(400).send("User doesn't exist");
            if(!manufactorer) return res.status(400).send("Manufactorer is required");
            if(!model) return res.status(400).send("Model is required");
            if(!fuel) return res.status(400).send("Fuel is required");
            if(!transmission) return res.status(400).send("Transmission is required");
            if(!mileage) return res.status(400).send("Mileage is required");
            if(!cubicasis) return res.status(400).send("Cubicasis is required");
            if(!enginePower) return res.status(400).send("Engine power is required");
            if(!music) return res.status(400).send("Music is required");
            if(!numberOfDoors) return res.status(400).send("Number of doors is required");
            if(!year) return res.status(400).send("Year is required");
            if(!horsePower) return res.status(400).send("Number of horse power is required");
            if(!drivetrain) return res.status(400).send("Drivetrain is required");
            if(!numberOfGears) return res.status(400).send("Number of gears is required");
            if(!registration) return res.status(400).send("Registration is required");
            if(!emisionStandard) return res.status(400).send("Emision standard is required");
            if(!type) return res.status(400).send("Typeis required");


            const newCar = await Cars.create({owner,price,images,manufactorer,model,fuel,transmission,mileage,cubicasis,enginePower,music,numberOfDoors,
                year,horsePower,drivetrain,numberOfGears,registration,emisionStandard,type,carEquipment:{
                rimSize,alarm,ABS,ESP,turbo,airbag,enterier,parkingCamera,parkingCensors,lights,navigation,
                touchScreen,bluetooth,startStopSystem},description,status,createdAt,views});

                return res.send("Added car successfully");

        }catch(e){
            console.error(e);
            return res.status(400).send("Could not add new car");   
        }
    });


        router.patch("/edit/:id", roleMiddleware("USER"), async (req, res) => {
        const carId = req.params.id;
        if (!carId) return res.status(400).send("Could not find specified car");

        const {
            images, manufactorer, model, fuel, transmission, mileage, cubicasis, enginePower, music, numberOfDoors,
            year, horsePower, drivetrain, numberOfGears, registration, emisionStandard, type, carEquipment, description, status ,views
        } = req.body;

        if (!images && !manufactorer && !model && !fuel && !transmission && !mileage && !cubicasis && !enginePower && !music && !numberOfDoors
            && !year && !horsePower && !drivetrain && !numberOfGears && !registration && !emisionStandard && !type && !carEquipment
            && !description && !status && !views) {
            return res.status(400).send("Car could not be updated because all fields are empty");
        }

        try {
            const car = await Cars.findById(carId);
            const updateCar = {};

            if (images && images !== car.images) updateCar.images = images;
            if (manufactorer && manufactorer !== car.manufactorer) updateCar.manufactorer = manufactorer;
            if (model && model !== car.model) updateCar.model = model;
            if (fuel && fuel !== car.fuel) updateCar.fuel = fuel;
            if (transmission && transmission !== car.transmission) updateCar.transmission = transmission;
            if (mileage && mileage !== car.mileage) updateCar.mileage = mileage;
            if (cubicasis && cubicasis !== car.cubicasis) updateCar.cubicasis = cubicasis;
            if (enginePower && enginePower !== car.enginePower) updateCar.enginePower = enginePower;
            if (music && music !== car.music) updateCar.music = music;
            if (numberOfDoors && numberOfDoors !== car.numberOfDoors) updateCar.numberOfDoors = numberOfDoors;
            if (year && year !== car.year) updateCar.year = year;
            if (horsePower && horsePower !== car.horsePower) updateCar.horsePower = horsePower;
            if (drivetrain && drivetrain !== car.drivetrain) updateCar.drivetrain = drivetrain;
            if (numberOfGears && numberOfGears !== car.numberOfGears) updateCar.numberOfGears = numberOfGears;
            if (registration && registration !== car.registration) updateCar.registration = registration;
            if (emisionStandard && emisionStandard !== car.emisionStandard) updateCar.emisionStandard = emisionStandard;
            if (type && type !== car.type) updateCar.type = type;
            if (description && description !== car.description) updateCar.description = description;
            if (status) updateCar.status = status;
            if (views) updateCar.views = car.views + 1;

                if (carEquipment) {
                    updateCar.carEquipment = {};

                    if (carEquipment.rimSize && carEquipment.rimSize !== car.carEquipment.rimSize) updateCar.carEquipment.rimSize = carEquipment.rimSize;
                    if (carEquipment.alarm && carEquipment.alarm !== car.carEquipment.alarm) updateCar.carEquipment.alarm = carEquipment.alarm;
                    if (carEquipment.ABS && carEquipment.ABS !== car.carEquipment.ABS) updateCar.carEquipment.ABS = carEquipment.ABS;
                    if (carEquipment.ESP && carEquipment.ESP !== car.carEquipment.ESP) updateCar.carEquipment.ESP = carEquipment.ESP;
                    if (carEquipment.turbo && carEquipment.turbo !== car.carEquipment.turbo) updateCar.carEquipment.turbo = carEquipment.turbo;
                    if (carEquipment.airbag && carEquipment.airbag !== car.carEquipment.airbag) updateCar.carEquipment.airbag = carEquipment.airbag;
                    if (carEquipment.enterier && carEquipment.enterier !== car.carEquipment.enterier) updateCar.carEquipment.enterier = carEquipment.enterier;
                    if (carEquipment.parkingCamera && carEquipment.parkingCamera !== car.carEquipment.parkingCamera) updateCar.carEquipment.parkingCamera = carEquipment.parkingCamera;
                    if (carEquipment.parkingCensors && carEquipment.parkingCensors !== car.carEquipment.parkingCensors) updateCar.carEquipment.parkingCensors = carEquipment.parkingCensors;
                    if (carEquipment.lights && carEquipment.lights !== car.carEquipment.lights) updateCar.carEquipment.lights = carEquipment.lights;
                    if (carEquipment.navigation && carEquipment.navigation !== car.carEquipment.navigation) updateCar.carEquipment.navigation = carEquipment.navigation;
                    if (carEquipment.touchScreen && carEquipment.touchScreen !== car.carEquipment.touchScreen) updateCar.carEquipment.touchScreen = carEquipment.touchScreen;
                    if (carEquipment.bluetooth && carEquipment.bluetooth !== car.carEquipment.bluetooth) updateCar.carEquipment.bluetooth = carEquipment.bluetooth;
                    if (carEquipment.startStopSystem && carEquipment.startStopSystem !== car.carEquipment.startStopSystem) updateCar.carEquipment.startStopSystem = carEquipment.startStopSystem;
                
            }

            const updated = await Cars.findByIdAndUpdate(carId, updateCar, { new: true });
            if (!updated) return res.status(400).send("Couldn't update car");

            return res.status(200).send("Car updated successfully");
        } catch (e) {
            return res.status(400).send(e?.message || "Something went wrong, try again");
        }
        });

        router.delete("/deleteCar/:id",roleMiddleware("USER"),async(req,res)=>{
        const carId = req.params.id;
            if(!carId) return res.status(400).send("Couldn't find car");
        try{
            const car = await Cars.findByIdAndDelete(carId);
            if(!car) return res.status(400).send("Car doesn't exist");

            return res.status(200).send("Car deleted successfully");
        }catch(e){
            return res.status(400).send(e?.message || "Something went wrong,try again");
        }
        });



    module.exports = router;