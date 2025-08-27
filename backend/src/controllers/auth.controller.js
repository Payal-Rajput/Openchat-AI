import bcrypt from 'bcryptjs';
import { createUser, findOneUser, findUser, updateUser } from "../dao/user.dao.js";
import config from '../config/config.js'
import jwt from 'jsonwebtoken'
import { sendOtpEmail } from "../services/mailer.service.js";

function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerController(req, res) {
    const { username, email, password } = req.body;

    const isUserExist = await findOneUser({
        $or: [
            {
                username
            },
            {
                email
            }
        ]
    });

    if (isUserExist) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
        username,
        email,
        password: hashedPassword,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await updateUser({ _id: user._id }, {
        emailVerificationOtp: otp,
        emailVerificationOtpExpiresAt: expiresAt,
        isEmailVerified: false,
    })

    await sendOtpEmail({ to: email, otp })

    return res.status(201).json({
        message: "User created successfully. OTP sent to email for verification."
    })

}


export async function loginController(req, res) {
    const { email, username, password } = req.body;

    const user = await findOneUser({
        $or: [ {username} , {email} ]
    })

    if(!user){
        return res.status(400).json({
            message:"invalid username or password"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid username or password"
        })
    }

    if(!user.isEmailVerified){
        return res.status(403).json({
            message:"Email not verified. Please verify using the OTP sent to your email."
        })
    }

    const token=jwt.sign({_id:user._id}, config.JWT_SECRET)
    res.cookie('token',token);

    return res.status(200).json({
        message:"login successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            image:user.image,
            bio:user.bio,

        }
    })
}


export async function logoutController(req, res) {
    res.clearCookie('token');
    return res.status(200).json({
        message: "logout successfully"
    });
}

export async function sendEmailVerificationOtpController(req, res){
    const { email } = req.body;
    const user = await findOneUser({ email })
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }
    if(user.isEmailVerified){
        return res.status(400).json({ message: 'Email already verified' })
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await updateUser({ _id: user._id }, {
        emailVerificationOtp: otp,
        emailVerificationOtpExpiresAt: expiresAt
    })

    await sendOtpEmail({ to: email, otp })

    return res.status(200).json({ message: 'OTP sent to email' })
}

export async function verifyEmailOtpController(req, res){
    const { email, otp } = req.body;
    const user = await findOneUser({ email })
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }
    if(user.isEmailVerified){
        return res.status(400).json({ message: 'Email already verified' })
    }

    if(!user.emailVerificationOtp || !user.emailVerificationOtpExpiresAt){
        return res.status(400).json({ message: 'No OTP pending' })
    }

    if(user.emailVerificationOtp !== otp){
        return res.status(400).json({ message: 'Invalid OTP' })
    }

    if(user.emailVerificationOtpExpiresAt < new Date()){
        return res.status(400).json({ message: 'OTP expired' })
    }

    await updateUser({ _id: user._id }, {
        isEmailVerified: true,
        emailVerificationOtp: null,
        emailVerificationOtpExpiresAt: null,
    })

    return res.status(200).json({ message: 'Email verified successfully' })
}