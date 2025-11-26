let app = require("./app")
let redis = require("./db/redis")
let { db } = require("./db/mysql");

(async function () {
    try {
        await db.authenticate().then(() => {
            console.log("connect to DB");
        })

        await redis.ping().then((pong) => {
            console.log(`PING -> ${pong}`);
        })

        await app.listen(process.env.PORT, () => {
            console.log(`server run on port ${process.env.PORT}`);
        })
    } catch (error) {
        await db.close()
        await redis.disconnect()
        throw error
    }
})()