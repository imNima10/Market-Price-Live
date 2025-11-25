let redis = require("../db/redis")
let bcrypt = require("bcrypt")

function getUserKeyPattern(userKey) {
    return `${userKey}:email`
}

async function setUserKey(userKey, email, expireTime) {
    await redis.set(getUserKeyPattern(userKey), email, "EX", expireTime * 60)
}

async function getUserKeyDetails(userKey) {
    let userKeyPattern = getUserKeyPattern(userKey)
    let userKey = await redis.get(userKeyPattern)
    if (!userKey) {
        return {
            expired: true,
            remainingTime: 0
        }
    }
    let remainingTime = await redis.ttl(userKeyPattern)
    let min = Math.floor(remainingTime / 60)
    let sec = Math.floor(remainingTime % 60)
    let time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
    return {
        expired: false,
        remainingTime: time,
        userKey
    }
}



function getOtpPattern(userKey) {
    return `${userKey}:otp`
}

async function setOtp(userKey, otp, expireTime) {
    let hashedOtp = await bcrypt.hash(otp, 10)
    await redis.set(getOtpPattern(userKey), hashedOtp, "EX", expireTime * 60)

}

async function getOtpDetails(userKey) {
    let otpPattern = getOtpPattern(userKey)
    let otp = await redis.get(otpPattern)
    if (!otp) {
        return {
            expired: true,
            remainingTime: 0
        }
    }
    let remainingTime = await redis.ttl(otpPattern)
    let min = Math.floor(remainingTime / 60)
    let sec = Math.floor(remainingTime % 60)
    let time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
    return {
        expired: false,
        remainingTime: time,
        otp
    }
}

module.exports = {
    getUserKeyPattern,
    setUserKey,
    getOtpPattern,
    setOtp,
    getOtpDetails,
    getUserKeyDetails
}