let logger = require("./../utils/logger")

module.exports = (err, req, res, next) => {
    //TODO (ValidationError)

    logger(err)

    let status = err.status || 500;
    return res.status(status).render("error", {
        status,
        title: err.title || "خطای سرور",
        message: err.message || "مشکلی رخ داده لطفا دوباره تلاش کنید"
    });
}