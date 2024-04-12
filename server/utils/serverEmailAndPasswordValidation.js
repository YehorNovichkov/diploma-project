module.exports = function (email, password) {
    let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    let passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/

    if (!email || !password) return false
    if (!email.match(emailReg)) return false
    // if (password.length < 8) return false
    // if (!password.match(passwordReg)) return false

    return true
}