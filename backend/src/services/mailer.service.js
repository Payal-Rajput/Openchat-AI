import nodemailer from 'nodemailer'
import config from '../config/config.js'



// ✅ Create transporter (reusable)
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail', // Or you can use "smtp.gmail.com"
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASS,
        },
    })
}

// ✅ Function to send OTP email
export async function sendOtpEmail({ to, otp }) {
    try {
        const transporter = createTransporter()

        const mailOptions = {
            from: `"EchoMind" <${config.EMAIL_USER}>`, // show app name
            to,
            subject: 'Your EchoMind verification code',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 10px;">
                    <h2>Email Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #2e86de;">${otp}</h1>
                    <p>This code will expire in <b>10 minutes</b>.</p>
                    <br/>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `,
            text: `Your verification code is ${otp}. It expires in 10 minutes.`, // fallback for plain-text email clients
        }

        await transporter.sendMail(mailOptions)
        console.log(`✅ OTP sent successfully to ${to}`)
    } catch (error) {
        console.error('❌ Error sending OTP email:', error.message)
        throw new Error('Failed to send OTP email')
    }
}



