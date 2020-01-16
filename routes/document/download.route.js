const express = require('express');
const errors = require('../../helpers/errors');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

const CUR_DIR = process.cwd();
const router = express.Router();

router.post('/download', (req, res) => {
    const file = `${CUR_DIR}/uploadDir/${req.body.fileName}`;

    const filename = path.basename(file);
    const mimetype = mime.getType(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
    filestream.on('error', function(err) {
        res
            .json({
                error: errors.DOWNLOAD_ERR,
                timestamp: Date.now()
            })
            .status(500);
    })
});

module.exports = router;
