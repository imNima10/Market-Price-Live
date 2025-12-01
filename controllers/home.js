let { getAssetsByAction, getFavoritesAssets } = require("../utils/assetsController")
exports.getDashboard = async (req, res, next) => {
    let assets = []//TODO

    return res.render("dashboard", {
        action: "dashboard",
        isLogin: !!req.user,
        assets
    })
}

exports.getByAction = async (req, res, next) => {
    let { action } = req.params
    let user = req.user

    let assets
    if (action == "favorites") {
        assets = await getFavoritesAssets(user)
    } else {
        assets = await getAssetsByAction(action,user)
    }
    return res.render("dashboard", {
        action,
        isLogin: true,
        assets
    })
}