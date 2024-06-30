const mongoose = require("mongoose");

const VerifySchema = new mongoose.Schema({

    email:{
        type:String
    },
    code:{
        type:String
    }


})
const VerifyModel = mongoose.model("verify",VerifySchema);
    
module.exports = VerifyModel;