import nodemailer from 'nodemailer'
import config from '../config/config.js'

export function createTransporter(){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })
    return transporter
}

export async function sendOtpEmail({ to, otp }){
    const transporter = createTransporter()
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your EchoMind verification code',
        text: `Your verification code is ${otp}. It expires in 10 minutes.`
    }
    await transporter.sendMail(mailOptions)
}


