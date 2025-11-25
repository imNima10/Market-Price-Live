exports.createOtp = async (length) => {
    let digits = "0123456789"
    let otp = ""
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * digits.length)
        otp += index
    }    
    console.log("otp =>" + otp);

    return otp
}