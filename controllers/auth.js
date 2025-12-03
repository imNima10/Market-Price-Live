let buildError = require("../utils/buildError")
let { createOtp } = require("../utils/otp")
let { setOtp, setUserKey, getUserKeyDetails, getOtpDetails, getOtpPattern, getUserKeyPattern, delUserKey, delOtp, deleteRefreshToken, saveRefreshToken } = require("../utils/redis")
let uuidV4 = require("uuid").v4
let { Users } = require("../db/mysql")
let bcrypt = require("bcrypt")
let sendOtp = require("../services/sendOtp")
let { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } = require("../utils/token")
let redis = require("../db/redis")

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
        next(error)
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
            throw buildError({ title: "OTP has expired", message: "OTP has expired, please request a new one", status: 400 })
        }

        let isOtpValid = await bcrypt.compare(otp, isOtpExists.otp)
        if (!isOtpValid) {
            req.flash("inlineError", "کد یک بار مصرف نادرست است.")
            return res.render("otp", {
                userKey
            })
        }

        let user = await Users.findOne({ where: { email }, raw: true })

        if (!user) {
            let isFirstUser = await Users.count()
            user = await Users.create({ email, role: isFirstUser == 0 ? "ADMIN" : "USER" })
        }

        await delUserKey(userKey)
        await delOtp(userKey)

        let accessToken = await createAccessToken(user)
        let refreshToken = await createRefreshToken(user)

        res.cookie("access-token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: process.env.ACCESS_TOKEN_EXPIRE * 60 * 1000
        })

        await deleteRefreshToken(user)
        await saveRefreshToken(user, refreshToken)
        return res.redirect("/p")
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req, res, next) => {
    try {
        let user = req.user

        res.clearCookie("access-token", {
            httpOnly: true,
            sameSite: "strict",
        })
        await redis.del(`refresh-token:${user.id}`)

        await deleteRefreshToken(user)

        return res.redirect("/auth/login")
    } catch (error) {
        next(error)
    }
}