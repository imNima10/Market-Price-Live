let { createOtp } = require("../utils/otp")
let { setOtp, setUserKey } = require("../utils/redis")
let uuidV4 = require("uuid").v4

exports.getLoginPage = (req, res) => {
    return res.render("login")
}

exports.login = async (req, res, next) => {
    try {
        let {email}=req.body

        let otp = await createOtp(6)
        let userKey = uuidV4()
        await setUserKey(userKey, email, 5)
        await setOtp(userKey, otp, 1)

        //TODO (send otp)

        return res.render("otp",{
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