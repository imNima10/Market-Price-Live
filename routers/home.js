let express = require("express")

let router = express.Router()

let controller = require("./../controllers/home")

let { authGuard } = require("./../middlewares/guards")

router.route("/")
    .get(controller.getDashboard)
router.route("/:action")
    .get(authGuard, controller.getByAction)

module.exports = router