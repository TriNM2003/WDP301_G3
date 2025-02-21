const bcrypt = require("bcrypt");


// salt: random text to password => more == stronger
// deafault: 10
const encryptPassword = async (password, saltNumber) => {
    const salt = await bcrypt.genSalt(saltNumber);
    return await bcrypt.hash(password, salt);
}

const compareDecryptedPasswordToPassword = async (encryptedPassword, password) => {
    return await bcrypt.compare(encryptedPassword, password);
}

const bcryptUtils = {
    encryptPassword,
    compareDecryptedPasswordToPassword
}

module.exports = bcryptUtils;