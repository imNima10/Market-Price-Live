let express = require("express")
let path = require("path")
let app = express()

let authRouter = require("./routers/auth")
let homeRouter = require("./routers/home")
const errorHandler = require("./middlewares/errorHandler")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use("/", homeRouter)
app.use("/auth", authRouter)

app.use((req, res) => {
    return res.render("error", {
        status: 404,
        title: "404 - پیدا نشد",
        message: "صفحه‌ای که دنبال آن هستید یافت نشد یا حذف شده است."
    })
})

app.use(errorHandler)

module.exports = app