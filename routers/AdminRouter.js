const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const ReportArticle = require("../models/ReportArticleModel");
const bcrypt = require("bcrypt");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const Cars = require("../models/CarModel");
const ReportUser = require("../models/ReportUserModel");
const RatingModel = require("../models/starRatingModel");

const router = express.Router();

const existingUsernames = [];
const existingPhones = [];
const existingEmails = [];
const existingDealerships = [];

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
const phoneNumberRegex = /^\+[0-9]+$/;

router.get("/allUsers",roleMiddleware("ADMIN"),async (req,res) =>{
    try{
        const user = await User.find();
        const carDealers = await CarDealerUser.find();
        const allUsers = [...user, ...carDealers];
        allUsers.password = undefined;

        return res.send(allUsers);
    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }
});


router.post("/createUser",roleMiddleware("ADMIN"),async({body},res) =>{
    try{
        const users = await User.find(); 
        const carDealerUsers = await CarDealerUser.find();
        const allUsers = [...users, ...carDealerUsers];
        allUsers.map(user => {
            existingUsernames.push(user.username);
            existingEmails.push(user.email);
            existingPhones.push(user.phoneNumber);
        });

        const {firstName,lastName,username,email,phoneNumber,password,location:{state,city},role,image} = body || {}; 

        if(!firstName) return res.status(400).send("Firstname is required");
        if(!lastName) return res.status(400).send("Lastname is required");
        if(!username) return res.status(400).send("Username is required");
        if(existingUsernames.includes(username))  return res.status(400).send("Username already exists");
        if(!email) return res.status(400).send("Email is required");
        if(existingEmails.includes(email))  return res.status(400).send("Email is already used");
        if(!emailRegex.test(email)) return res.status(400).send("Email is not valid (user123@gmail.com)");
        if(!phoneNumberRegex.test(phoneNumber)) return res.status(400).send("Phone number is not valid (+387 12123123)");
        if(!phoneNumber) return res.status(400).send("Phone number is required");
        if(existingPhones.includes(phoneNumber))  return res.status(400).send("Phone number is already used");
        if(!password) return res.status(400).send("Password is required");
        if(!city) return res.status(400).send("City is required");
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password,salt);
        body.password = hash;


        const newUser = await User.create({firstName,lastName,username,email,phoneNumber,password:hash,location:{state,city},role,image});
        existingUsernames.push(username);
        existingPhones.push(phoneNumber);
        existingEmails.push(email);
        newUser.password = undefined;
        return res.send(newUser);

    }catch(e){
        console.error(e);
        return res.status(400).send("Couldn't create new user");   
    }
});

router.post("/createCarDealer",roleMiddleware("ADMIN"),async({body},res) =>{
    try{

        const users = await User.find() 
        const carDealerUsers = await CarDealerUser.find();
        const allUsers = [...users, ...carDealerUsers];
        if (allUsers.length === 0) return res.status(400).send("No users found...");
        allUsers.map(user => {
            existingDealerships.push(user.dealershipName);
            existingEmails.push(user.email);
            existingPhones.push(user.phoneNumber);
        });

        const {dealershipName,contact:{email,phoneNumber},password,location:{state,city},role,image} = body || {};

        if(!dealershipName) return res.status(400).send("Dealership name is required");
        if(existingDealerships.includes(dealershipName))  return res.status(400).send("Dealership already exists");
        if(!email) return res.status(400).send("Email is required");
        if(existingEmails.includes(email))  return res.status(400).send("Email is already used");
        if(!emailRegex.test(email)) return res.status(400).send("Email is not valid (user123@gmail.com)");
        if(!phoneNumberRegex.test(phoneNumber)) return res.status(400).send("Phone number is not valid (+387 12123123)");
        if(!phoneNumber) return res.status(400).send("Phone number is required");
        if(existingPhones.includes(phoneNumber))  return res.status(400).send("Phone number is already used");
        if(!password) return res.status(400).send("Password is required");
        if(!city) return res.status(400).send("City is required");

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password,salt);
        body.password = hash;

        const newUser = await CarDealerUser.create({dealershipName,contact:{email,phoneNumber},password:hash,location:{state,city},role,image});
        existingDealerships.push(dealershipName);
        existingPhones.push(phoneNumber);
        existingEmails.push(email);
        newUser.password = undefined;
        return res.send(newUser);

    }catch(e){
        console.error(e);
        return res.status(400).send("Couldn't create new car dealer");   
    }
});

router.patch("/user/:id",roleMiddleware("ADMIN"), async (req, res) => {
    const userId = req.params.id;
    const {firstName,lastName,username,email,phoneNumber,password,location,image,role} = req.body;

    if (!firstName && !role && !lastName && !username && !email && !phoneNumber && !password && (!location || (!location.state && !location.city)) && !image) {
        return res.status(400).send("User could not be updated because all fields are empty");
    } 

    try {
    const user = await User.findById(userId); 
    const users = await User.find();

    users.map(user => {
        existingUsernames.pop(user.username);
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

    if (role){
        if(role === user.role){
            return res.status(400).send("You've entered an existing role");  
        }else{
            updateData.role = role;
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

        return res.send(updatedUser);
        
    } catch(e) {
        return res.status(400).send(e?.message || "Something went wrong");
    }
});

router.delete("/user/:id",roleMiddleware("ADMIN"),async(req,res) => {
    const userId = req.params.id;
    if(!userId) return res.status(400).send("Couldn't find user")
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user) return res.status(400).send("Couldn't delete user")
        return res.status(200).send("User deleted successfully");    
    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }

});

router.patch("/carDealer/:id",roleMiddleware("ADMIN"), async (req, res) => {
    const userId = req.params.id;
    const {dealershipName,contact,password,location,image,role} = req.body;

    if (!dealershipName  && !role && (!contact || (!contact.email && !contact.phoneNumber)) && !password && (!location || (!location.state && !location.city)) && !image) {
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
    
    if (role){
        if(role === user.role){
            return res.status(400).send("You've entered an existing role");  
        }else{
            updateData.role = role;
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

router.delete("/carDealer/:id",roleMiddleware("ADMIN"),async(req,res) => {
    const userId = req.params.id;
    if(!userId) return res.status(400).send("Couldn't find user")
    try{
        const user = await CarDealerUser.findByIdAndDelete(userId);
        if(!user) return res.status(400).send("Couldn't delete user")
        return res.status(200).send("User deleted successfully");    
    }catch(e){
        res.status(400).send(e?.message || "Something went wrong");
    }

});


router.get("/allCars",roleMiddleware("ADMIN"),async(req,res)=>{

    try {
        const allCars = await Cars.find().populate("owner").limit(20);
        if(allCars.lenght === 0){
            res.send("There is no cars avaible")
        }else{
            res.send(allCars);

        }
    } catch (e) {
        res.status(400).send("Users fetching failed...");
    }
});

router.post("/addCar",roleMiddleware("ADMIN"),async({body},res)=>{
    try{
        const {owner,images,manufactorer,model,fuel,transmission,mileage,cubicasis,enginePower,music,numberOfDoors,
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


        const newCar = await Cars.create({owner,images,manufactorer,model,fuel,transmission,mileage,cubicasis,enginePower,music,numberOfDoors,
            year,horsePower,drivetrain,numberOfGears,registration,emisionStandard,type,carEquipment:{
            rimSize,alarm,ABS,ESP,turbo,airbag,enterier,parkingCamera,parkingCensors,lights,navigation,
            touchScreen,bluetooth,startStopSystem},description,status,createdAt,views});

            return res.send(newCar);

    }catch(e){
        console.error(e);
        return res.status(400).send("Could not add new car");   
    }
});

router.get("/car/details/:id",roleMiddleware("ADMIN"),async(req,res)=>{
        const carId = req.params.id;
        if(!carId) return res.status(400).send("Couldn't find car");
    try{
        const car = await Cars.findById(carId).populate("owner");
        if(!car) return res.status(400).send("Couldn't find car");

        res.send(car);
    }catch(e){
        res.status(400).send(e?.message || "Something went wrong,try again");
    }

});

router.patch("/car/edit/:id", roleMiddleware("ADMIN"), async (req, res) => {
    const carId = req.params.id;
    if (!carId) return res.status(400).send("Could not find specified car");

    const {
        images, manufactorer, model, fuel, transmission, mileage, cubicasis, enginePower, music, numberOfDoors,
        year, horsePower, drivetrain, numberOfGears, registration, emisionStandard, type, carEquipment, description, status
    } = req.body;

    if (!images && !manufactorer && !model && !fuel && !transmission && !mileage && !cubicasis && !enginePower && !music && !numberOfDoors
        && !year && !horsePower && !drivetrain && !numberOfGears && !registration && !emisionStandard && !type && !carEquipment
        && !description && !status) {
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
        if (status && status !== car.status) updateCar.status = status;


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

        return res.send(updated);
    } catch (e) {
        return res.status(400).send(e?.message || "Something went wrong, try again");
    }
});

router.delete("/car/delete/:id",roleMiddleware("ADMIN"),async(req,res)=>{
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

router.get("/carReps",roleMiddleware("ADMIN"),async(req,res)=>{
    
    try{
        const carReports = await ReportArticle.find().populate("reportedBy").populate("reportedArticle");
        if(!carReports) return res.status(400).send("There is no avaible car reports");

        return res.send(carReports);
    }catch(e){
        return res.status(400).send(e?.message || "Couldn't get car reports");
    }
});

router.delete("/carRep/:id",roleMiddleware("ADMIN"),async(req,res)=>{
    const Id = req.params.id;
    if(!Id) return res.status(400).send("Couldn't find report");

    try{
        const carReports = await ReportArticle.findByIdAndDelete(Id);
        if(!carReports) return res.status(400).send("There is no avaible car reports");

        return res.send("Report resolved and deleted successfully");
    }catch(e){
        return res.status(400).send(e?.message || "Couldn't get car reports");
    }
});

router.get("/userReps",roleMiddleware("ADMIN"),async(req,res)=>{
    
    try{
        const userReports = await ReportUser.find().populate("reportedBy").populate("reportedUser");
        if(!userReports) return res.status(400).send("There is no avaible car reports");

        return res.send(userReports);
    }catch(e){
        return res.status(400).send(e?.message || "Couldn't get car reports");
    }
});

router.delete("/userRep/:id",roleMiddleware("ADMIN"),async(req,res)=>{
    const Id = req.params.id;
    if(!Id) return res.status(400).send("Couldn't find report");

    try{
        const userReports = await ReportUser.findByIdAndDelete(Id);
        if(!userReports) return res.status(400).send("There is no avaible car reports");

        return res.send("Report resolved and deleted successfully");
    }catch(e){
        return res.status(400).send(e?.message || "Couldn't get car reports");
    }
});

router.get("/getRatings",roleMiddleware("ADMIN"),async(req,res)=>{
    
    try{
        const rating = await RatingModel.find().populate("ratedBy");
        if(!rating) return res.status(400).send("There is no avaible app ratings");

        return res.send(rating);
    }catch(e){
        return res.status(400).send(e?.message || "Couldn't get app ratings");
    }
});

module.exports = router;