const express = require('express');
const router = express.Router();
const tokenGenerateHelper = require('../../helpers/auth/tokenGenerate.helper');
const User = require('../../db/user');
const errors = require('../../helpers/errors');
const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const fs = require('fs');

const publicKEY = fs.readFileSync('./public.key', 'utf8');

router.post('/refresh-token', (req, res, next) => {
        let refreshToken = req.cookies['refresh_token'];
        let userId = req.body.userId === undefined ? 1 : req.body.userId;
        if (refreshToken) {
            User
                .getUserById(userId)
                .then(user => {
                    if (refreshToken === user.refresh_token) {
                        jwt.verify(refreshToken, publicKEY, config.jwtConfig.accessToken, (err, decoded) => {
                            if (Date.now() < decoded.exp * 1000) {
                                tokenGenerateHelper
                                    .generateTokenPair(user.login)
                                    .then(token => {
                                        User
                                            .updateUserById(user.id, {
                                                refresh_token: token.refreshToken,
                                                access_token: token.accessToken
                                            });
                                        res
                                            .cookie('token', token.accessToken, config.cookieConf.accessToken)
                                            .cookie('refresh_token', token.refreshToken, config.cookieConf.refreshToken)
                                            .json({
                                                timestamp: Date.now()
                                            });
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
                    } else {
                        return res
                            .status(401)
                            .json({
                                error: errors.INVALID_TOKEN,
                                timestamp: Date.now()
                            });
                    }
                });
        } else {
            return res
                .status(401)
                .json({
                    error: errors.INVALID_TOKEN,
                    timestamp: Date.now()
                });
        }

    }
);

module.exports = router;
