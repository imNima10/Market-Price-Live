let redis = require("../db/redis")
let bcrypt = require("bcrypt")

function getUserKeyBackUpPattern(email) {
    return `userKey:${email}`
}

function getUserKeyPattern(userKey) {
    return `${userKey}:email`
}

function getUserKeyUsesPattern(userKey) {
    return `${userKey}:uses:email`
}

async function setUserKey(userKey, email, expireTime) {
    await redis.set(getUserKeyPattern(userKey), email, "EX", expireTime * 60)
    await redis.set(getUserKeyUsesPattern(userKey), 1, "EX", expireTime * 60)
    await redis.set(getUserKeyBackUpPattern(email), userKey, "EX", expireTime * 60)
}

async function getUserKeyDetails({ userKey, email }) {
    if (email) {
        userKey = await redis.get(getUserKeyBackUpPattern(email))
    }
    let userKeyPattern = getUserKeyPattern(userKey)
    let userKeyUsesPattern = getUserKeyUsesPattern(userKey)
    let theUserKey = await redis.get(getUserKeyPattern(userKey))
    let theUserKeyUses = await redis.get(userKeyUsesPattern)
    if (!theUserKey) {
        return {
            expired: true,
            remainingTime: 0,
        }
    }
    let remainingTime = await redis.ttl(userKeyPattern)
    let min = Math.floor(remainingTime / 60)
    let sec = Math.floor(remainingTime % 60)
    let time = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`

    return {
        expired: false,
        remainingTime: time,
        email: theUserKey,
        hasFreeUses: parseInt(theUserKeyUses) <= 3,
        userKey
    }
}



function getOtpPattern(userKey) {
    return `${userKey}:otp`
}

function getOtpUsesPattern(userKey) {
    return `${userKey}:uses:otp`
}

async function setOtp(userKey, otp, expireTime) {
    let hashedOtp = await bcrypt.hash(otp, 10)
    await redis.set(getOtpPattern(userKey), hashedOtp, "EX", expireTime * 60)
    await redis.set(getOtpUsesPattern(userKey), 1, "EX", expireTime * 60)

}

async function getOtpDetails(userKey) {
    let otpPattern = getOtpPattern(userKey)
    let otp = await redis.get(otpPattern)
    let otpUsesPattern = getOtpUsesPattern(userKey)
    let otpUses = await redis.get(otpUsesPattern)
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
        otp,
        hasFreeUses: parseInt(otpUses) <= 3
    }
}

async function delUserKey({ userKey, email }) {
    if (email) {
        userKey = await redis.get(getUserKeyBackUpPattern(email))
    } else {
        email = await redis.get(getUserKeyPattern(userKey))
    }
    await redis.del(getUserKeyPattern(userKey))
    await redis.del(getUserKeyUsesPattern(userKey))
    await redis.del(getUserKeyBackUpPattern(email))
}
async function delOtp(userKey) {
    await redis.del(getOtpPattern(userKey))
    await redis.del(getOtpUsesPattern(userKey))
}

async function incrUserKeyUses(userKey) {
    await redis.incr(getUserKeyUsesPattern(userKey))
}
async function incrOtpUses(userKey) {
    await redis.incr(getOtpUsesPattern(userKey))
}

module.exports = {
    setUserKey,
    getUserKeyDetails,
    setOtp,
    getOtpDetails,
    delOtp,
    delUserKey,
    incrOtpUses,
    incrUserKeyUses
}