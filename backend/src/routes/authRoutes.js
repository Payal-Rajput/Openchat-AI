import express from "express";
import { loginController, registerController, logoutController, sendEmailVerificationOtpController, verifyEmailOtpController, getMeController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authmiddleware.js";

const router=express.Router();

router.post('/register',registerController)
router.post('/login',loginController)
router.post('/logout',logoutController)
router.post('/send-otp',sendEmailVerificationOtpController)
router.post('/verify-otp',verifyEmailOtpController)
router.get('/me', authMiddleware, getMeController)

export default router