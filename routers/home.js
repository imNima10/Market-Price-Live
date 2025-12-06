let express = require("express")

let router = express.Router()

let controller = require("./../controllers/home")

let { authGuard } = require("./../middlewares/guards")
let validator = require("./../middlewares/validator")
const { home_actionSchema } = require("../validators")

router.route("/")
    .get(authGuard(false), controller.getDashboard)
router.route("/:action")
    .get(authGuard(), validator({ validate: home_actionSchema, from: "params" }), controller.getByAction)

module.exports = router