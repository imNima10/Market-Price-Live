let express = require("express")

let router = express.Router()

let controller = require("./../controllers/auth")

router.route("/login")
    .get(controller.getLoginPage)
    .post(controller.login)

router.route("/verify")
    .post(controller.otpVerify)

module.exports = router