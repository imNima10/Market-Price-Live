let { Users } = require("../db/mysql")
let JWT = require("jsonwebtoken")
let buildError = require("./buildError")

exports.createAccessToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE + "m"
        })
        return token
    } catch (error) {
        throw buildError({
            title: "Failed to create access token",
            message: error.message,
            status: 500
        })
    }
}

exports.createRefreshToken = async (user) => {
    try {
        let token = await JWT.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE + "d"
        })
        return token
    } catch (error) {
        throw buildError({
            title: "Failed to create refresh token",
            message: error.message,
            status: 500
        })
    }
}

exports.verifyAccessToken = async (token) => {
    try {
        let payload = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
        let isUserExists = await Users.findOne({ where: { id: payload.id }, raw: true })
        if (!isUserExists) {
            throw new Error("User not found")
        }
        return isUserExists
    } catch (error) {
        throw buildError({
            title: "Access token verification failed",
            message: error.message,
            status: 401
        })
    }
}

exports.verifyRefreshToken = async (token) => {
    try {
        let payload = await JWT.verify(token, process.env.REFRESH_TOKEN_SECRET)
        let isUserExists = await Users.findOne({ where: { id: payload.id }, raw: true })
        if (!isUserExists) {
            throw new Error("User not found")
        }
        return isUserExists
    } catch (error) {
        throw buildError({
            title: "Refresh token verification failed",
            message: error.message,
            status: 401
        })
    }
}