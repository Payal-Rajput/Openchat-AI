import express from "express";
import { loginController, registerController, logoutController, sendEmailVerificationOtpController, verifyEmailOtpController } from "../controllers/auth.controller.js";

const router=express.Router();

router.post('/register',registerController)
router.post('/login',loginController)
router.post('/logout',logoutController)
router.post('/send-otp',sendEmailVerificationOtpController)
router.post('/verify-otp',verifyEmailOtpController)


export default router