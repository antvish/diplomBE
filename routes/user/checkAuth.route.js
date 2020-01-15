const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const errors = require('../../helpers/errors');
const fs = require('fs');
const User = require('../../db/user');

const publicKEY  = fs.readFileSync('./public.key', 'utf8');

router.post('/checkAuth', (req, res, next) => {
    let token = req.cookies['token'];
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
                let userId = req.body.id === undefined ? 1 : req.body.id;
                User
                    .getUserById(userId)
                    .then(user => {
                        if(user.access_token === token) {
                            req.decoded = decoded;
                            res.status(200)
                                .json({
                                    timestamp: Date.now()
                                });
                        } else {
                            return res
                                .status(401)
                                .json({
                                    error: errors.INVALID_TOKEN,
                                    timestamp: Date.now()
                                });
                        }
                    });
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
});

module.exports = router;
