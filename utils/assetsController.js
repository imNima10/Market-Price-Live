let { Assets } = require("../db/mysql")
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