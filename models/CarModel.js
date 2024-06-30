const mongoose = require("mongoose");

const CarSchema = mongoose.Schema({
        
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "CarDealerUser" || "User"
    },
    price:{
        required:true,
        type:Number
    },
    images:[{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrRty7jdxvwweo8pfVF0LVcXINGABhOUrQrw&s"
    }],
    manufactorer:{
        type:String,
        required:true
    },
    model:{
        type:String,
        required:true
    },
    fuel:{
        type:String,
        required:true
    },
    transmission:{
        type:String,
        required:true
    },
    mileage:{
        type:Number,
        required:true
    },
    cubicasis:{
        type:String,
        required:true
    },
    enginePower:{
        type:Number,
        required:true
    },
    music:{
        type:String,
        required:true
    },
    numberOfDoors:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    horsePower:{
        type:Number,
        required:true
    },
    drivetrain:{
        type:String,
        required:true
    },
    numberOfGears:{
        type:Number,
        required:true
    },
    registration:{
        type:String,
        required:true
    },
    emisionStandard:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    carEquipment:{
        rimSize:{
            type:Number,
            default:0
        },
        alarm:{
            type:Boolean,
            default:false
        },
        ABS:{
            type:Boolean,
            default:false
        },
        ESP:{
            type:Boolean,
            default:false
        },
        turbo:{
            type:Boolean,
            default:false
        },
        airbag:{
            type:Boolean,
            default:false
        },
        enterier:{
            type:String,
            default:"N/A"
        },
        parkingCamera:{
            type:Boolean,
            default:false
        },
        parkingCensors:{
            type:Boolean,
            default:false
        },
        lights:{
            type:String,
            default:"N/A"
        },
        navigation:{
            type:Boolean,
            default:false
        },
        touchScreen:{
            type:Boolean,
            default:false
        },
        bluetooth:{
            type:Boolean,
            default:false
        },
        startStopSystem:{
            type:Boolean,
            default:false
        }
    },
    description:{
        type:String,
        default:"N/A"
    },
    status:{
        type:String,
        default:"ACTIVE"
    },
    createdAt:{
        type:Date,
        default: Date.now

    },
    views:{
        type:Number,
        default:0
    }


});

const carsModel = mongoose.model("Cars",CarSchema);

module.exports = carsModel;