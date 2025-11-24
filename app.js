let express = require("express")
let path = require("path")
let app = express()

let authRouter = require("./routers/auth")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

app.use("/auth", authRouter)

app.use((req, res) => {
    return res.render("404")
})

module.exports = app