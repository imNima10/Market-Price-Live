let express = require("express")

let router = express.Router()

let controller = require("./../controllers/auth")
const { authGuard } = require("../middlewares/guards")

router.route("/login")
    .get(controller.getLoginPage)
    .post(controller.login)

router.route("/verify")
    .post(controller.otpVerify)

router.route("/logout")
    .post(authGuard(), controller.logout)

module.exports = router