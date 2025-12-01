let { Assets, Users, Favorites, Populars } = require("../db/mysql")
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

async function getAllAssetsFromRedis() {
    let actions = ["gold", "crypto", "currency"]
    let results = await Promise.all(
        actions.map(action => getAssetsFromRedis(action))
    );

    let allAssets = results.flat();
    return allAssets
}

async function selectFavAssetsFromRedis(allAssets, favAssets) {
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

async function getAssetWithSymbol(symbol) {
    let assets = await Assets.findOne({
        where: {
            symbol
        }
    })

    return assets
}

async function getThePopularAssets() {
    let assets = await Populars.findAll({
        attributes: [],
        include: [
            {
                model: Assets,
                as: "asset",
                attributes: { exclude: ["updated_at", "created_at"] },

            }
        ]
    })

    assets = assets.map(p => p.asset);

    return assets
}

async function checkFavoritesAndUpdate(asset, user) {
    let favAsset = await Favorites.findOne({
        where: {
            asset_id: asset.id,
            user_id: user.id
        }
    })

    if (favAsset) {
        await favAsset.destroy()
        return {
            status: true,
            add: false
        }
    } else {
        await Favorites.create({
            asset_id: asset.id,
            user_id: user.id
        })
        return {
            status: true,
            add: true
        }
    }
}

async function updateAssetsForAddFavorite(allAssets, user) {

    allAssets.forEach(asset => {
        asset.isFav = false
    })


    if (user) {
        let favAssets = await getFavoritesAssetsFromMysqlDB(user)
        favAssets.forEach(favAsset => {
            allAssets.forEach(asset => {
                if (asset.symbol == favAsset.dataValues.symbol && asset.title == favAsset.dataValues.title) {
                    asset.isFav = true
                }
            })
        })
    }

    return allAssets
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
exports.getAssetsByAction = async (action, user) => {
    try {
        let assets = await getAssetsFromRedis(action)
        assets = await updateAssetsForAddFavorite(assets, user)
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

        let allAssets = await getAllAssetsFromRedis()
        let assets = await selectFavAssetsFromRedis(allAssets, favAssets)
        assets = await updateAssetsForAddFavorite(assets, user)
        return assets
    } catch (error) {
        throw error
    }
}
exports.addOrRemoveFavoriteAsset = async (user, symbol) => {
    try {
        let asset = await getAssetWithSymbol(symbol)

        let response = await checkFavoritesAndUpdate(asset, user)

        return response
    } catch (error) {
        throw error
    }
}
exports.getPopularAssets = async (user) => {
    try {
        let popAsset = await getThePopularAssets()

        let allAssets = await getAllAssetsFromRedis()

        allAssets = await selectFavAssetsFromRedis(allAssets, popAsset)

        let assets = await updateAssetsForAddFavorite(allAssets, user)
        return assets
    } catch (error) {
        throw error
    }
}