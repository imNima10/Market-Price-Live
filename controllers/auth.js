let buildError = require("../utils/buildError")
let { createOtp } = require("../utils/otp")
let { setOtp, setUserKey, getUserKeyDetails, getOtpDetails, getOtpPattern, getUserKeyPattern, delUserKey, delOtp } = require("../utils/redis")
let uuidV4 = require("uuid").v4
let { Users } = require("../db/mysql")
let bcrypt = require("bcrypt")
let sendOtp = require("../services/sendOtp")
let logger= require("../utils/logger")
let {createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken}= require("../utils/token")

exports.getLoginPage = (req, res) => {
    return res.render("login")
}

exports.login = async (req, res, next) => {
    try {
        let { email } = req.body

        let otp = await createOtp(6)
        let userKey = uuidV4()
        await setUserKey(userKey, email, 5)
        await setOtp(userKey, otp, 1)

        await sendOtp({ email, otp })

        return res.render("otp", {
            userKey
        })
    } catch (error) {
        next({
            status: error.status || 500,
            error: "Local Login Error",
            message: error.message
        })
    }
}

exports.otpVerify = async (req, res, next) => {
    try {
        let { userKey, otp } = req.body

        let email = await getUserKeyDetails(userKey)
        if (email.expired) {
            throw buildError({ title: "Invalid link", message: "Invalid or expired login link , please request a new one", status: 401 })
        }
        email = email.email
        let isOtpExists = await getOtpDetails(userKey)
        if (isOtpExists.expired) {
            throw buildError({ title: "OTP has expired", message: "OTP has expired, please request a new one", status: 401 })
        }

        let isOtpValid = await bcrypt.compare(otp, isOtpExists.otp)
        if (!isOtpValid) {
            throw buildError({ title: "Incorrect OTP", message: "Incorrect OTP, please try again", status: 401 })
        }

        let user = await Users.findOne({ where: { email } })
        if (!user) {
            let isFirstUser = await Users.count()
            user = await Users.create({ email, role: isFirstUser == 0 ? "ADMIN" : "USER" })
        }

        await delUserKey(userKey)
        await delOtp(userKey)

        let accessToken=await createAccessToken(user)
        let refreshToken=await createRefreshToken(user)

        

        return res.redirect("/")
    } catch (error) {
        next(error)
    }
}