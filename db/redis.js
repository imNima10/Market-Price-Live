let { Redis } = require("ioredis")

let redis = new Redis(process.env.REDIS_URI)

module.exports = redis