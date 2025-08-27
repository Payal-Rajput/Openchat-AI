import mongoose from "mongoose";
import config from "../config/config.js";

function connectDB(){
    mongoose.connect(config.Mongodb_URL)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log(err);
    })
}

export default connectDB;