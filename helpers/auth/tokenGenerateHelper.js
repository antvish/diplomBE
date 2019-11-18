const jwt = require('jsonwebtoken');
const config = require('../../config');
const user = require('../../db/user');

let generateAuthToken = function(login) {
    let id = user.getUserIdByLogin(login);
    //get the private key from the config file -> environment variable
    return jwt.sign({id: id}, config.secret)
};

module.exports = {
    generateAuthToken: generateAuthToken
};
