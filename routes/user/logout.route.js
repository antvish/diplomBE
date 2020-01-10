const express = require('express');
const router = express.Router();
const User = require('../../db/user');


router.post('/logout', (req, res, next) => {
    let user_id = req.body.id === undefined ? 1 : req.body.id;
    User
        .updateUserById(user_id, {refresh_token: '', access_token: ''});
    try {
        res
            .status(200)
            .json({timestamp: Date.now()});
    } catch (e) {
        res.status(500);
    }

});

module.exports = router;
