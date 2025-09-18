const bcrypt = require('bcrypt');

const passwordVerification = async (inputPassword, accountPassword) => {
    const passwordMatch = await bcrypt.compare(inputPassword, accountPassword)
    
    if (!passwordMatch) {
        return false
    }

    return true
};

module.exports = passwordVerification;
