const express = require("express");
const {config} = require("dotenv");
const mongoose = require("mongoose");
const UserRouter = require("./routers/UserRouter");
const CarDealerRouter = require("./routers/CarDealerRouter");
const Cars = require("./routers/CarRouter");
const adminRouter = require("./routers/AdminRouter");
const loginRouter = require("./routers/UserLogin");
const favCar = require("./routers/FavoriteArticleRouter");
const favSearch = require("./routers/FavoriteSearchRouter");
const repCar = require("./routers/RepArticleRouter");
const repUser = require("./routers/RepUserRouter");
const registerUser = require ("./routers/RegisterRouter");
const guestCars = require("./routers/getCars"); 
const postRating = require("./routers/postRating");
const repProblem = require('./routers/ReportProblem');
const cors = require('cors');
const { authMiddleware } = require("./middlewares/authMiddleware");
config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/login",loginRouter);
app.use("/register",registerUser);
app.use("/car",guestCars);

app.use(authMiddleware);

app.use("/reportProblem",repProblem);
app.use("/postRating",postRating);
app.use("/favoriteCar",favCar);
app.use("/repCar",repCar);
app.use("/repUser",repUser);
app.use("/favoriteSearch",favSearch);
app.use("/user",UserRouter);
app.use("/CarDealerUser",CarDealerRouter);
app.use("/cars",Cars);
app.use("/admin",adminRouter);

const startServer = () =>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log("---Server running---");
    });
}

const connectToDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION);
        console.log("---Connected to database---");
        startServer();
    }catch(e){
        console.error("Connection to database failed", e)
    }
}

connectToDatabase();