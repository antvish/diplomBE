const express = require('express');
const errors = require('../../helpers/errors');

const CUR_DIR = process.cwd();
const router = express.Router();

router.get('/download', (req, res) => {
    const file = `${CUR_DIR}/uploadDir/${req.body.fileName}`;
    res.download(file, `${req.body.fileName}`, (err) => {
        if (err) {
            res
                .json({
                    error: errors.DOWNLOAD_ERR,
                    timestamp: Date.now()
                })
                .status(500);
        } else {
            res
                .status(200);
        }
    });
});

module.exports = router;
