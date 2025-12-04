const buildError = require("../utils/buildError");

module.exports = ({ validate, from = "body", url, inline = false, reqBody }) => {
    return async (req, res, next) => {
        try {
            let validateFrom;

            switch (from.toLowerCase()) {
                case "body":
                    validateFrom = req.body;
                    break;
                case "params":
                    validateFrom = req.params;
                    break;
                case "query":
                    validateFrom = req.query;
                    break;
                default:
                    throw buildError({ status: 500, title: "validation failed", message: `Invalid validation source: ${from}` })
            }

            await validate.validate(validateFrom, { abortEarly: false });

            next();
        } catch (error) {
            if (inline) {
                req.inline = true
                //TODO
            }
            next(error);
        }
    }
};