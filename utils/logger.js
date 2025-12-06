module.exports = (err) => {
    console.log({
        success: false,
        status: err.status,
        error: err.title || "",
        message: err.message || "",
        data: err.data || ""
    });
}