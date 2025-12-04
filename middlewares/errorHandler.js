let logger = require("./../utils/logger")

module.exports = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const errorList = Array.isArray(err.inner) && err.inner.length
            ? err.inner.map(e => ({
                field: e.path,
                message: e.message
            }))
            : [{ field: "", message: err.message }];

        err.title = "Validation Error"
        err.message = errorList[0].message
        err.data = errorList
        err.status = 404
    }

    logger(err)

    if (req.inline) {
        //TODO
    }

    err.status = err.status ? err.status : 500

    switch (err.status) {
        case 500:
            err = {
                status: err.status,
                title: "خطای سرور",
                message: "یک خطای داخلی سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید."
            }
            break;
        case 403:
            err = {
                status: err.status,
                title: "دسترسی غیر مجاز",
                message: "شما اجازه دسترسی به این بخش را ندارید."
            }
            break;
        case 401:
            err = {
                status: err.status,
                title: "عدم دسترسی",
                message: "برای دسترسی به این بخش باید وارد حساب کاربری خود شوید."
            }
            break;
        case 404:
            err = {
                status: err.status,
                title: "404 - پیدا نشد",
                message: "صفحه‌ یا دیتایی که دنبال آن هستید یافت نشد یا حذف شده است."
            }
            break;
    }

    return res.status(err.status).render("error", {
        status: err.status,
        title: err.title,
        message: err.message
    });
}