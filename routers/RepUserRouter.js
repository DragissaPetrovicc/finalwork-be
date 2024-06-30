const express = require("express");
const User = require("../models/UserModel");
const CarDealerUser = require("../models/CarDealerUserModel");
const { roleMiddleware } = require("../middlewares/authMiddleware");
const ReportUser = require("../models/ReportUserModel");

const router = express.Router();

router.post("/:id",roleMiddleware("USER"),async(req,res)=>{

    const userId = req.params.id;
    const {reportedUserId,reason,additionalMessage} = req.body;
    console.log(reportedUserId);
    try{
        if(!userId) return res.status(400).send("Couldn't find you,try again");

        const users = await User.find();
        const carDealer = await CarDealerUser.find();
        const allUsers = [...users,...carDealer];
    
        const foundUser = allUsers.find(u=> userId === u.id); 
        if(!foundUser) return res.status(400).send("Specified user doesn't exist");  

        if(!reportedUserId) return res.status(400).send("You didn't specify which user you are reporting");

        const foundReportedUser = allUsers.find(u => reportedUserId === u.id);
        if(!foundReportedUser) return res.status(400).send("User you reporting doesn't exist"); 

        if(!reason) return res.status(400).send("Reason is required");

        const repUser = ReportUser.create({reportedBy:foundUser,reportedUser:foundReportedUser,reason,additionalMessage});

        if(!repUser) return res.status(400).send("Unable to report user");

        return res.send("User reported successfully");

    }catch(e){
        return res.status(400).send(e?.message || "Something went wrong");
    }
});


module.exports = router;