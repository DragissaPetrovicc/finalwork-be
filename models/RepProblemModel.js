const mongoose = require("mongoose");

const RepProblem = mongoose.Schema({

  reportedBy:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CarDealerUser" || "User"
},
    problem:{
        type:String,
        required:true
    },
    
    createdAt:{
        type:Date,
        default: Date.now
    }

});

const ReportProblem = mongoose.model("ReportProblem",RepProblem);

module.exports = ReportProblem;