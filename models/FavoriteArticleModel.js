const mongoose = require("mongoose");

const FavoriteArticleModel = mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CarDealerUser" || "User"
},
    car:{
        
        type: mongoose.Schema.Types.ObjectId,
        ref:"Cars",
        required:true
        
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

const FavoriteArticle = mongoose.model("FavoriteArticle",FavoriteArticleModel);

module.exports = FavoriteArticle;