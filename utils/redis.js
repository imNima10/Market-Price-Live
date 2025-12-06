let redis = require("../db/redis")

async function deleteRefreshToken(user) {
    await redis.del(`refresh-token:${user.id}`)
}
async function saveRefreshToken(user, refreshToken) {
    await redis.set(`refresh-token:${user.id}`, refreshToken, "EX", process.env.REFRESH_TOKEN_EXPIRE * 24 * 60 * 60)
}
async function saveAssetsToRedis(action, assets) {
    await redis.set(`assets:${action}`, JSON.stringify(assets));
}
async function getAssetsByAction(action) {
    let assets = await redis.get(`assets:${action}`);
    assets=JSON.parse(assets)
    return assets
}

module.exports = {
    deleteRefreshToken,
    saveRefreshToken,
    saveAssetsToRedis,
    getAssetsByAction
}