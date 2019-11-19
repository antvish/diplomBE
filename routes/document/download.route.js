const express = require('express');
const errors = require('../../helpers/errors');

const CUR_DIR = process.cwd();
const router = express.Router();

router.get('/download', (req, res) => {
    const file = `${CUR_DIR}/uploadDir/${req.fileName}`;
    res.download(file, `${req.fileName}`, (err) => {
        if (err) {
            res
                .status(500)
                .json({
                    error: errors.DOWNLOAD_ERR,
                    timestamp: Date.now()
                });
        } else {
            res
                .status(200)
                .json({
                    timestamp: Date.now()
                });
        }
    });
});

module.exports = router;
