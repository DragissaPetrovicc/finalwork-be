const mongoose = require("mongoose");

const RepUserModel = mongoose.Schema({

  reportedBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CarDealerUser" || "User"
},
    reportedUser:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CarDealerUser" || "User"
        
    },
    reason:{
        type:String,
        required:true
    },
    additionalMessage:{
        type:String,
        default:"N/A"
    },
    createdAt:{
        type:Date,
        default: Date.now
    }

});

const ReportUser = mongoose.model("ReportUser",RepUserModel);

module.exports = ReportUser;