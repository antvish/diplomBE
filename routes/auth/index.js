const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../db/user');
const kek = require('../../helpers/auth/tokenGenerate.helper');


//Route paths are prepended with /auth

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

router.post('/signup', (req, res, next) => {
    if (validUser(req.body)) {
        User
            .getUserByLogin(req.body.login)
            .then(user => {
                // if user not found
                if (!user) {
                    //hash the password
                    bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                            //insert user into db
                            const user = {
                                login: req.body.login,
                                password: hash,
                            };
                            User
                                .create(user)
                                .then(id => {
                                    res.json({
                                        message: 'zaregalsya'
                                    })
                                });
                        });
                } else {
                    next(new Error('Login in use'));
                }
            });
    } else {
        next(new Error('Inavlid user'));
    }
});

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
                                let token = kek.generateAuthToken(req.body.login);
                                console.log(token);
                                res
                                    .header("x-auth-token", token)
                                    .json({
                                        message: 'Logged in...'
                                    })
                            } else {
                                next(new Error('Invalid login or password'));
                            }

                        });

                } else {
                    next(new Error('Invalid login or password'))
                }
            })
    } else {
        next(new Error('Invalid login or password'))
    }
});

module.exports = router;
