let express=require("express")

let router=express.Router()

let controller=require("./../controllers/auth")

router.route("/login")
.get(controller.getLoginPage)
.post(controller.login)


module.exports=router