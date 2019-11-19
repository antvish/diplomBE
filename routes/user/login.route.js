const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../db/user');
const tokenGenerateHelper = require('../../helpers/auth/tokenGenerate.helper');
const conf = require('../../config');
const errors = require('../../helpers/errors');

//Can login with valid email
//Cant login with blank email
//Cant login with blank password
function validUser(user) {
    const validLogin = typeof user.login == 'string' &&
        user.login.trim() !== '';
    const validPassword = typeof user.password == 'string' &&
        user.password.trim() !== '' &&
        user.password.trim().length >= 6;

    return validLogin && validPassword;
}

router.post('/login', (req, res, next) => {
    if (validUser(req.body)) {
        //check if the in db
        User
            .getUserByLogin(req.body.login)
            .then(user => {
                if (user) {
                    //compare password with hashed password
                    bcrypt.compare(req.body.password, user.password)
                        .then((result) => {
                            //if the password match
                            if (result) {
                                User.updateUserByLogin(user.login, {user_ip: req.ip, user_agent: req.get('User-Agent')});
                                tokenGenerateHelper
                                    .generateAuthToken(req.body.login)
                                    .then(token => {
                                        res
                                            .cookie('token', token, conf.cookieConf)
                                            .json({
                                                message: 'Logged in...'
                                            })
                                    });
                            } else {
                                res
                                    .status(401)
                                    .json({
                                        error: errors.INVALID_CREDENTIALS,
                                        timestamp: Date.now()
                                    });
                            }
                        });

                } else {
                    res
                        .status(401)
                        .json({
                            error: errors.INVALID_CREDENTIALS,
                            timestamp: Date.now()
                        });
                }
            })
    } else {
        res
            .status(401)
            .json({
                error: errors.INVALID_CREDENTIALS,
                timestamp: Date.now()
            });
    }
});
module.exports = router;
