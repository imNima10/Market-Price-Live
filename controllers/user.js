const { addOrRemoveFavoriteAsset } = require("../utils/assetsController")

exports.favorites = async (req, res, next) => {
    try {
        let { symbol } = req.params
        let user = req.user

        let response = await addOrRemoveFavoriteAsset(user, symbol)
        
        res.redirect("/p/favorites")
    } catch (error) {

    }
}