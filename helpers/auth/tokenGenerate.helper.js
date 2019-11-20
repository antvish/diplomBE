const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../db/user');
const fs = require('fs');
const crypto = require('crypto');

const privateKEY = {
    access: fs.readFileSync('./private.key', 'utf8'),
    refresh: fs.readFileSync('./private.key', 'utf8'),
};

let generateAccessToken = function (login) {
    return User
        .getUserByLogin(login)
        .then(user => {
            return jwt.sign({
                    id: user.id,
                    ip: user.user_ip,
                    ua: user.user_agent,
                },
                privateKEY.access,
                config.jwtConfig.accessToken,
            )
        })
};

let generateRefreshToken = function (login) {
    return User
        .getUserByLogin(login)
        .then(user => {
            return jwt.sign({
                    id: user.id,
                    ip: user.user_ip,
                    ua: user.user_agent,
                },
                privateKEY.refresh,
                config.jwtConfig.refreshToken,
            )
        })
};

let generateTokenPair = function (login) {
    return {
        accessToken: generateAccessToken(login),
        refreshToken: generateRefreshToken(login),
    }
};

let generateTwoStepAuthToken = function(length = 4) {
    return crypto.randomBytes(length).toString('hex');
};

module.exports = {
    generateTokenPair: generateTokenPair,
    generateAccessToken: generateAccessToken,
    generateTwoStepAuthToken: generateTwoStepAuthToken
};
