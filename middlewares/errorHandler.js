let logger = require("./../utils/logger")

module.exports = (err, req, res, next) => {
    //TODO (ValidationError)

    logger(err)

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
    }

    return res.status(err.status).render("error", {
        status: err.status,
        title: err.title,
        message: err.message
    });
}