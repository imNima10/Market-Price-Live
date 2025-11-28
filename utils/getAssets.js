let { Assets } = require("../db/mysql")
let api = require("../services/api")

async function getAssetsFromApi(action) {
    let assets = await api.get(action)

    return assets
}

async function getAssetsFromDb(action) {
    let assets = await Assets.findAll({
        where: { type: action },
        raw: true
    })

    return assets
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

exports.getAssetsByAction = async (action) => {
    try {
        let dbAssets = await getAssetsFromDb(action)
        let apiAssets = await getAssetsFromApi(action)
        let assets = await selectAssets(dbAssets,apiAssets)
        return assets
    } catch (error) {
        throw error
    }
}