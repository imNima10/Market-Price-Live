let api = require("../services/api")
exports.getDashboard = async (req, res, next) => {
    let assets=[]//TODO
    
    return res.render("dashboard", {
        action: "dashboard",
        isLogin: false,
        assets
    })
}

exports.getByAction = async (req, res, next) => {
    let { action } = req.params
    let assets = await api.get(action)
    return res.render("dashboard", {
        action: action,
        isLogin: true,
        assets
    })
}