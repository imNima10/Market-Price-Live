let nodemailer = require("nodemailer")
const buildError = require("../utils/buildError")

module.exports = async ({ email, otp }) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.OTP_EMAIL_USER,
                pass: process.env.OTP_EMAIL_PASSWORD
            }
        })

        let mailOptions = {
            from: process.env.OTP_EMAIL_FROM,
            to: email,
            subject: "Otp For Login",
            text: `Hi👋, Welcome\nYour Otp Code For Login\n${otp}`
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        throw await buildError({ status: 500, message: "Failed to send OTP" })
    }
}