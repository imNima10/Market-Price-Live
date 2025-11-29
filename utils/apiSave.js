let { getAssetsByActionForSave } = require("./assetsController");
let { saveAssetsToRedis } = require("./redis");

let actions = ["gold", "crypto", "currency"];
let index = 0;

async function getAndSave(action) {
    try {
        let assets = await getAssetsByActionForSave(action)
        await saveAssetsToRedis(action, assets)

        console.log(`[${new Date().toLocaleTimeString()}] Updated ${action}`);
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] Error fetching ${action}:`, error.message);
    }
}

module.exports = () => {
    setInterval(() => {
        let action = actions[index];
        getAndSave(action);

        index = (index + 1) % actions.length;
    }, 60 * 1000);
}
