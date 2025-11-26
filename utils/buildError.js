module.exports = ({status = 400, title, message, data}) => {
    const error = new Error(message);
    error.status = status;
    error.title = title;
    error.data = data;
    return error;
};