const yup = require("yup");

exports.user_favoriteSchema = yup.object({
    symbol: yup
        .string()
        .required("نماد ارسال نشده")
});

exports.home_actionSchema = yup.object({
    action: yup
        .string()
        .oneOf(["currency", "crypto", "gold", "favorites"], "اکشن معتبر نیست")
        .required("اکشن ارسال نشده"),
});


exports.auth_loginSchema = yup.object({
    email: yup
        .string()
        .trim()
        .matches(
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            "ایمیل معتبر وارد کنید"
        )
        .notRequired(),

    userKey: yup
        .string()
        .trim()
        .notRequired(),

}).test(
    "email-or-userKey",
    "وارد کردن ایمیل یا کلید کاربری الزامی است",
    function (values) {
        return Boolean(values.email || values.userKey)
    }
)


exports.auth_verifySchema = yup.object({
    otp: yup
        .string()
        .matches(/^\d{6}$/, "کد تایید باید ۶ رقم باشد")
        .required("کد تایید ضروری است"),

    userKey: yup
        .string()
        .trim()
        .required("کلید کاربر ضروری هست"),
});

