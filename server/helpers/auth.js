const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        throw err;
    }
};

const comparePassword = async (password, hashed) => {
    try {
        return await bcrypt.compare(password, hashed);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    hashPassword,
    comparePassword
};