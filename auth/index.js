const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../db/user');

//Route paths are prepended with /auth

router.get('/', (req, res) => {
    res.json({
        message: '/auth'
    })
});

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
    if(validUser(req.body)) {
        console.log(req.body.login);
        User
            .getOneByLogin(req.body.login)
            .then(user => {
                console.log('user', user);
                if(!user) {
                    res.json({
                        message: 'nice'
                    })
                } else {
                    next(new Error('Login in use'));
                }
            });
    } else {
        next(new Error('Inavlid user'));
    }
});

module.exports = router;
