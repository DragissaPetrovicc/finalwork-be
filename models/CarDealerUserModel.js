const mongoose = require("mongoose");

const CarDealerModel = new mongoose.Schema({
    dealershipName:{
        type: String,
        required: true,
        unique: true,
    },
    contact:{
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique:true
        }
    },
    password:{
        type:String,
        required:true
    },
    location:{
        state:{
            type:String,
            default:"Bosnia and Herzegovina"
        },
        city:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"USER"
    },
    image:{
        type:String,
        default:"data:image/jpeg;base64,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"
    },
    verification:{
        type:Boolean,
        default:false
    }

});

const CarDealerUser = mongoose.model("CarDealerUser",CarDealerModel);

module.exports = CarDealerUser;