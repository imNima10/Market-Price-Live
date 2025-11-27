let { Users } = require("../db/mysql")
let JWT = require("jsonwebtoken")

exports.createAccessToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE + "m"
        })
        return token
    } catch (error) {
        throw {
            message: "Failed to create access token",
            data: error.message,
            status: 500
        }
    }
}

exports.createRefreshToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE + "d"
        })
        return token
    } catch (error) {
        throw {
            message: "Failed to create refresh token",
            data: error.message,
            status: 500
        }
    }
}

exports.verifyAccessToken = async (token) => {
    try {
        let payload = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let isUserExists = await Users.findOne({ where: { id: payload.id } })
        if (!isUserExists) {
            throw new Error("User not found")
        }
        return isUserExists
    } catch (error) {
        throw {
            message: "Access token verification failed",
            status: 401,
            data: error.message
        }
    }
}

exports.verifyRefreshToken = async (token) => {
    try {
        let payload = await JWT.verify(token, process.env.REFRESH_TOKEN_SECRET)
        let isUserExists = await Users.findOne({ where: { id: payload.id } })
        if (!isUserExists) {
            throw new Error("User not found")
        }
        return isUserExists
    } catch (error) {
        throw {
            message: "Refresh token verification failed",
            status: 401,
            data: error.message
        }
    }
}