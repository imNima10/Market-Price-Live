module.exports = (err) => {
    console.log({
        success: false,
        error: err.title || "",
        message: err.message || "",
        data: err.data || ""
    });
}