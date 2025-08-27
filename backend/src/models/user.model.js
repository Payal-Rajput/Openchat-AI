import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,

    },
    bio:{
        type:String,
        default:"",
        trim:true,
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        trim:true,
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    emailVerificationOtp:{
        type:String,
        default:null,
        index:true,
    },
    emailVerificationOtpExpiresAt:{
        type:Date,
        default:null,
    },
    
})

const userModel=mongoose.model("userai",userSchema);

export default userModel;