let express = require("express")

let router = express.Router()

let controller = require("./../controllers/home")

router.route("/")
    .get(controller.dashboard)

module.exports = router