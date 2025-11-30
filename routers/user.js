let express = require("express")

let router = express.Router()

let controller = require("./../controllers/user")

let { authGuard } = require("./../middlewares/guards")

router.get("/favorite/:symbol", authGuard(true), controller.favorites)

module.exports = router