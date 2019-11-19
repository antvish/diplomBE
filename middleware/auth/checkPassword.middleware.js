const bcrypt = require('bcrypt');
const passwordValidation = require('../../helpers/auth/password.helper');
/**
 * @description make from req.body.password hash and compare it with existing password hash
 * @return {Promise} true/Error
 */
module.exports = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, result) => {
            if (error) return reject(new Error(error));
            if (!result) return reject(new Error('error'));
            return resolve(result)
        })
    })
};
