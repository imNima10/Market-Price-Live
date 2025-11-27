let axios = require("axios");
const buildError = require("../utils/buildError");

exports.get = async (action) => {
    try {
        let response = await axios.get(`https://api.majidapi.ir/prices?action=${action}&token=${process.env.MAJIDAPI_TOKEN}`).then((response) => {
            if (response.data.status == 200) {
                return response.data.result;
            }
        })
        return response
    } catch (error) {
        throw buildError({ status: 500, message: "Failed to request to API" })
    }
}