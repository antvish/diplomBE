const jwt = require('jsonwebtoken');
const config = require('../../config.js');


let checkToken = (req, res, next) => {
    let token = req.cookies['token']; // Express headers are auto converted to lowercase
    if (token) {
        jwt.verify(token, config.secret, config.jwtConfig, (err, decoded) => {
            if (err) {
                return res.json({
                    timestamp: Date.now(),
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            timestamp: Date.now(),
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken
};
