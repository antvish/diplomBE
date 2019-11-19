const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../db/user');
const fs = require('fs');

const privateKEY = fs.readFileSync('./private.key', 'utf8');

let generateAuthToken = function (login) {
    return User
        .getUserByLogin(login)
        .then(user => {
            return jwt.sign({
                    id: user.id,
                    ip: user.user_ip,
                    ua: user.user_agent,
                },
                privateKEY,
                config.jwtConfig,
            )
        })
};
module.exports = {
    generateAuthToken: generateAuthToken
};
