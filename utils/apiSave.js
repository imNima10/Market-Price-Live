let redis = require("../db/redis");
let api = require("../services/api")

let actions = ["gold", "crypto", "currency"];
let index = 0;

async function getFromApi(action) {
    try {
        let assets = await api.get(action)

        return assets
    } catch (error) {
        throw error
    }
}

async function saveToRedis(assets, action) {
    await redis.set(`assets:${action}`, JSON.stringify(assets));
}

async function getAndSave(action) {
    try {
        let assets = await getFromApi(action)
        await saveToRedis(assets, action)

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
