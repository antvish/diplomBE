const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../db/user');
const fs = require('fs');

const privateKEY = fs.readFileSync('./private.key', 'utf8');

let generateAuthToken = function (login) {
    return User
        .getUserIdByLogin(login)
        .then(id => {
            return jwt.sign({
                    id: id.id,
                },
                privateKEY,
                config.jwtConfig,
            )
        })
};
module.exports = {
    generateAuthToken: generateAuthToken
};
