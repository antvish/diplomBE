const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../db/user');
const tokenGenerateHelper = require('../../helpers/auth/tokenGenerate.helper');
const conf = require('../../config');
const errors = require('../../helpers/errors');
const crypto = require('crypto');

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
                                //generate two step token
                                let two_step_token = tokenGenerateHelper.generateTwoStepAuthToken();
                                User
                                    .updateUserByLogin(req.body.login, {two_step_token: two_step_token});
                                //logs two step token
                                console.log('Your\'s two step token is : ' + two_step_token);
                                res
                                    .json({
                                        timestamp: Date.now()
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

router.post('/login2', (req, res, next) => {
    let user_id = req.body.id === undefined ? 1 : req.body.id;
    //get user id
    User
        .getUserById(user_id)
        .then(user => {
            console.log(user['two_step_token'] + '    ' + req.body.token);
            //if two step from request token equals two step token frob db
            if (req.body.token === user['two_step_token']) {
                //update user data with IP and User-Agent
                User
                    .updateUserById(user_id, {two_step_token: '', user_ip: req.ip, user_agent: req.get('User-Agent')});
                //generate token pair for user
                tokenGenerateHelper
                    .generateTokenPair(user.login)
                    .then(token => {
                        User
                            .updateUserById(user_id, {refresh_token: token.refreshToken, access_token: token.accessToken});
                        res
                            .cookie('token', token.accessToken, conf.cookieConf.accessToken)
                            .cookie('refresh_token', token.refreshToken, conf.cookieConf.refreshToken)
                            .json({
                                timestamp: Date.now()
                            });
                    });

            } else {
                //if two step from request token NOT equals two step token frob db
                res
                    .status(401)
                    .json({
                        error: errors.INVALID_TOKEN,
                        timestamp: Date.now()
                    });
            }
        });
});
module.exports = router;
