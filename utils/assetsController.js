let { Assets, Users } = require("../db/mysql")
let api = require("../services/api")
let { getAssetsByAction } = require("./redis")

async function getAssetsFromMysqlDB(action) {
    let assets = await Assets.findAll({
        where: { type: action },
        raw: true
    })

    return assets
}

async function getAssetsFromRedis(action) {
    let assets = await getAssetsByAction(action)
    return assets
}

async function getAssetsFromApi(action) {
    try {
        let assets = await api.get(action)

        return assets
    } catch (error) {
        throw error
    }
}

async function selectAssets(dbAssets, allAssets) {
    let assets = []
    dbAssets.map(theDbAsset => {
        allAssets.map(theAllAsset => {
            if (theAllAsset.symbol == theDbAsset.symbol) {
                assets.push(theAllAsset)
            }
        })
    });
    return assets
}

async function selectFavAssetsFromRedis(favAssets) {
    let actions = ["gold", "crypto", "currency"]
    let results = await Promise.all(
        actions.map(action => getAssetsFromRedis(action))
    );

    let allAssets = results.flat();
    
    
    let assets = []
    allAssets.forEach(asset => {        
        favAssets.forEach(favAsset => {

            if (asset.symbol == favAsset.dataValues.symbol && asset.title == favAsset.dataValues.title) {
                assets.push(asset)
            }
        });
    })
    return assets
}

async function getFavoritesAssetsFromMysqlDB(user) {
    let assets = await Users.findByPk(user.id, {
        include: [
            {
                model: Assets,
                as: "assets",
                attributes: { exclude: ["updated_at", "created_at"] },
                through: { attributes: [] }
            }
        ],
        raw: false
    })

    return assets.assets
}

exports.getAssetsByActionForSave = async (action) => {
    try {
        let dbAssets = await getAssetsFromMysqlDB(action)
        let allAssets = await getAssetsFromApi(action)
        let assets = await selectAssets(dbAssets, allAssets)
        return assets
    } catch (error) {
        throw error
    }
}
exports.getAssetsByAction = async (action) => {
    try {
        let assets = await getAssetsFromRedis(action)
        return assets
    } catch (error) {
        throw error
    }
}
exports.getFavoritesAssets = async (user) => {
    try {
        let favAssets = await getFavoritesAssetsFromMysqlDB(user)

        if (!favAssets.length) {
            return []
        }
        let assets = await selectFavAssetsFromRedis(favAssets)
        return assets
    } catch (error) {
        throw error
    }
}