let express = require("express")

let router = express.Router()

let controller = require("./../controllers/auth")
const { authGuard } = require("../middlewares/guards")
let validator = require("./../middlewares/validator")
const { auth_loginSchema, auth_verifySchema } = require("../validators")

router.get("/login", controller.getLoginPage)

// router.post("/otp", validator({ validate: auth_loginSchema, from: "body", inline: true }), controller.login)
router.post("/otp", controller.login)

router.get("/otp/:userKey", controller.getOtpPage)

router.post("/verify", validator({ validate: auth_verifySchema, from: "body", inline: true }), controller.otpVerify)

router.route("/logout")
    .post(authGuard(), controller.logout)

module.exports = router