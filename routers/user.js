let express = require("express")

let router = express.Router()

let controller = require("./../controllers/user")

let { authGuard } = require("./../middlewares/guards")

router.post("/favorite/:symbol", authGuard(true), controller.favorites)

module.exports = router