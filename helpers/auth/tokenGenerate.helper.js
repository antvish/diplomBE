const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../db/user');

let generateAuthToken = function(login) {
    return jwt.sign({id: user.getUserIdByLogin(login)}, config.secret)
};

module.exports = {
    generateAuthToken: generateAuthToken
};