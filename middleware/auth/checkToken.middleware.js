const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const errors = require('../../helpers/errors');
const fs = require('fs');

const publicKEY  = fs.readFileSync('./public.key', 'utf8');

let checkToken = (req, res, next) => {
    let token = req.cookies['token']; // Express headers are auto converted to lowercase
    let refreshToken = req.cookies['refresh_token'];
    jwt.verify(refreshToken, publicKEY, config.jwtConfig.refreshToken, (err, decoded) => {
        console.log(decoded);
    });
    if (token) {
        jwt.verify(token, publicKEY, config.jwtConfig.accessToken, (err, decoded) => {
            if (err) {
                return res
                    .status(401)
                    .json({
                        error: errors.INVALID_TOKEN,
                        timestamp: Date.now()
                    });
            } else if(decoded.ip !== req.ip || decoded.ua !== req.get('User-Agent')) {
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

let checkTwoStepTemporaryToken = function() {

};

let checkTwoStepToken = function() {

};

module.exports = {
    checkToken: checkToken
};
