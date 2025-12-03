let express = require("express")
let path = require("path")
let app = express()

let cookieParser = require("cookie-parser")
let cors = require("cors")
let helmet = require("helmet")
let flash = require("express-flash")
let session = require("express-session")

let authRouter = require("./routers/auth")
let userRouter = require("./routers/user")
let homeRouter = require("./routers/home")
const errorHandler = require("./middlewares/errorHandler")

//? middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(cors())
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET
}))
app.use(flash())
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

//? routes

app.use("/p", homeRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)

app.use((req, res) => {
    return res.render("error", {
        status: 404,
        title: "404 - پیدا نشد",
        message: "صفحه‌ای که دنبال آن هستید یافت نشد یا حذف شده است."
    })
})

app.use(errorHandler)

module.exports = app