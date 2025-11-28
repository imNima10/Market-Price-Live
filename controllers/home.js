let { getAssetsByAction } = require("../utils/getAssets")
exports.getDashboard = async (req, res, next) => {
    let assets = []//TODO

    return res.render("dashboard", {
        action: "dashboard",
        isLogin: false,
        assets
    })
}

exports.getByAction = async (req, res, next) => {
    let { action } = req.params
    let assets = await getAssetsByAction(action)
    return res.render("dashboard", {
        action,
        isLogin: true,
        assets
    })
}