const mongoose = require("mongoose");

const FavoriteSearchModel = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "CarDealerUser" || "User"
    },
    carList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cars",
      required: true
    }],
    createdAt:{
      type:Date,
      default: Date.now
  }

});

const FavoriteSearch = mongoose.model("FavoriteSearch",FavoriteSearchModel);

module.exports = FavoriteSearch;