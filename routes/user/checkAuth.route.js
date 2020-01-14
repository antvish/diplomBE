const express = require('express');
const router = express.Router();

router.post('/checkAuth', (req, res, next) => {
    let token = req.cookies['token'];
    console.log(token);
    if (token) {
        try {
            res
                .status(200)
                .json({timestamp: Date.now()});
        } catch (e) {
            res.status(500);
        }
    } else {
        res
            .status(401)
            .json({timestamp: Date.now()});

    }
});

module.exports = router;
