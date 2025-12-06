let express = require("express")

let router = express.Router()

let controller = require("./../controllers/user")

let { authGuard } = require("./../middlewares/guards")
let validator = require("./../middlewares/validator")
const { user_favoriteSchema } = require("../validators")

router.post("/favorite/:symbol", authGuard(true), validator({ validate: user_favoriteSchema, from: "params" }), controller.favorites)

module.exports = router