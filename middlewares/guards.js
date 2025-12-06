let buildError = require("../utils/buildError")
let { verifyAccessToken } = require("../utils/token")

exports.authGuard = (isLoginImportant = true) => {
    return async (req, res, next) => {
        try {
            let accessToken = req.cookies["access-token"];

            if (!accessToken) {
                if (isLoginImportant) {
                    throw buildError({ status: 401, title: "Unauthorized access", message: "User not found" })
                } else {
                    return next()
                }
            }

            let user = await verifyAccessToken(accessToken)

            req.user = user
            req.isAdmin = user.role == "ADMIN" ? true : false
            return next()
        } catch (error) {
            next(error)
        }
    }
}

exports.roleGuard = async (req, res, next) => {
    try {
        if (!req?.isAdmin) {
            throw buildError({ status: 403, title: "Forbidden access", message: "This router is protected, and you don't have access" })
        }
    } catch (error) {
        next(error)
    }
}