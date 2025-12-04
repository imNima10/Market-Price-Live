let express = require("express")

let router = express.Router()

let controller = require("./../controllers/auth")
const { authGuard } = require("../middlewares/guards")
let validator = require("./../middlewares/validator")
const { auth_loginSchema, auth_verifySchema } = require("../validators")

router.route("/login")
    .get(controller.getLoginPage)
    .post(validator({ validate: auth_loginSchema, from: "body", inline: true }), controller.login)

router.route("/verify")
    .post(validator({ validate: auth_verifySchema, from: "body", inline: true }), controller.otpVerify)

router.route("/logout")
    .post(authGuard(), controller.logout)

module.exports = router