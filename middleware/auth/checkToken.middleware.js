const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const errors = require('../../helpers/errors');
const fs = require('fs');

const publicKEY  = fs.readFileSync('./public.key', 'utf8');

let checkToken = (req, res, next) => {
    let token = req.cookies['token']; // Express headers are auto converted to lowercase
    if (token) {
        jwt.verify(token, publicKEY, config.jwtConfig, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({
                        error: errors.INVALID_TOKEN,
                        timestamp: Date.now()
                    });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res
            .status(401)
            .json({
                error: errors.NO_TOKEN_ERR,
                timestamp: Date.now()
            });
    }
};

module.exports = {
    checkToken: checkToken
};
