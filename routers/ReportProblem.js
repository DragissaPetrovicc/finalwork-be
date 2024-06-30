const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const ReportProblem = require('../models/RepProblemModel');
const { roleMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/repProblem/:id",roleMiddleware('USER'),async (req, res) => {

    const userId = req.params.id;
    const {problem} = req.body;
    try {
        const users = await User.findById(userId); 
        const carDealerUsers = await CarDealerUser.findById(userId);

        if(!users){

            if(carDealerUsers){
                res.send(carDealerUsers);
            }else{
                return res.status(400).send("User doesn't exist");
            }
        }else{
           
            await ReportProblem.create({reportedBy:userId,problem});
            return res.status(200).send('Problem reported successfully');
        
        }

    } catch (e) {
        console.log(e);
        return res.status(400).send(e?.message || "Username or dealership name is wrong");
    }
});

router.get("/repProblems",roleMiddleware('ADMIN'),async (req, res) => {

    try {

        const repProblems = await ReportProblem.find().populate('reportedBy');
        return res.status(200).send(repProblems);

    } catch (e) {
        console.log(e);
        return res.status(400).send(e?.message || "Username or dealership name is wrong");
    }
});

module.exports = router;