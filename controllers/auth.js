let buildError = require("../utils/buildError")
let { createOtp } = require("../utils/otp")
let { deleteRefreshToken, saveRefreshToken } = require("../utils/redis")
let { setOtp, setUserKey, getUserKeyDetails, getOtpDetails, delUserKey, delOtp, incrOtpUses, incrUserKeyUses } = require("../utils/auth")
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
        let { email, userKey } = req.body
        let otp;
        let userKeyDetails = userKey
            ? await getUserKeyDetails({ userKey })
            : await getUserKeyDetails({ email })

        if (!userKeyDetails.expired) {
            if (!userKeyDetails.hasFreeUses) {
                req.flash("error", "ایمیل شما نمیتواند کد جدید دریافت کند!")
                req.flash("error2", `${userKeyDetails.remainingTime} تا دریافت کد جدید`)
                return res.redirect("/auth/login")
            }
            
            const otpDetails = await getOtpDetails(userKeyDetails.userKey)
            
            if (!otpDetails.expired) {
                req.flash("error", "شما یک کد یک بار مصرف فعال دارید!")
                req.flash("error2", `${otpDetails.remainingTime} تا دریافت کد جدید`)
                return res.redirect("/auth/login")
            }

            otp = await createOtp(6)
            email = userKeyDetails.email
            userKey = userKeyDetails.userKey

            await incrUserKeyUses(userKey)
        } else if (email) {            
            userKey = uuidV4()
            await setUserKey(userKey, email, 5)
            otp = await createOtp(6)
        } else {
            req.flash("error", "اطلاعات ورود نامعتبر است")
            req.flash("error2", "لطفا دوباره اطلاعات خود را وارد کنید!")
            return res.redirect("/auth/login")
        }

        await setOtp(userKey, otp, 1)
        await sendOtp({ email, otp })

        await sendOtp({ email, otp })
        req.flash("success", "کد یک بار مصرف ارسال شد!")
        return res.redirect(`/auth/otp/${userKey}`)
    } catch (error) {
        next(error)
    }
}

exports.getOtpPage = async (req, res, next) => {
    try {
        let { userKey } = req.params
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

        let email = await getUserKeyDetails({ userKey })
        if (email.expired) {
            req.flash("error", "لینک نامعتبر است!")
            req.flash("error2", "لطفا دوباره تلاش کنید.")
            return res.redirect("/auth/login")
        } else if (!email.hasFreeUses) {
            req.flash("error", "اعتبار لینک تمام شد.")
            req.flash("error2", "لطفا دوباره تلاش کنید.")
            return res.redirect("/auth/login")
        }

        let isOtpExists = await getOtpDetails(userKey)
        if (isOtpExists.expired) {
            req.flash("expireError", "زمان کد یک بار مصرف به پایان رسید.")
            req.flash("expireError2", "دوباره ارسال شود؟")
            await delOtp(userKey)
            return res.redirect(`/auth/otp/${userKey}`)
        } else if (!isOtpExists.hasFreeUses) {
            req.flash("expireError", "اعتبار کد یک بار مصرف تمام شد.")
            req.flash("expireError2", "دوباره ارسال شود؟")
            await delOtp(userKey)
            await incrUserKeyUses(userKey)
            return res.redirect(`/auth/otp/${userKey}`)
        }

        let isOtpValid = await bcrypt.compare(otp, isOtpExists.otp)
        if (!isOtpValid) {
            await incrOtpUses(userKey)
            req.flash("inlineError", "کد یک بار مصرف نادرست است.")
            return res.redirect(`/auth/otp/${userKey}`)
        }

        email = email.email
        let user = await Users.findOne({ where: { email }, raw: true })

        if (!user) {
            let isFirstUser = await Users.count()
            user = await Users.create({ email, role: isFirstUser == 0 ? "ADMIN" : "USER" })
        }

        await delUserKey({ userKey })
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
        req.flash("success", "خوش اومدی!")
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

        req.flash("success", "به امید دیدار!")
        return res.redirect("/auth/login")
    } catch (error) {
        next(error)
    }
}