const express = require('express');
const fs = require('fs-extra');
const CUR_DIR = process.cwd();
const crypto = require('crypto');
const moment = require('moment');

const router = express.Router();

function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}


function validFile(hash, file) {
    return checksum(file) === hash;
}

router.post('/upload', (req, res) => {
    let name = req.body.fileName;
    //Check if there is no file prodivev
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Looks like you did not provide any file');
    } else {
        //check hashsum of the recieved file
        if (validFile(req.files[name].md5, req.files[name].data)) {
            //moving file to upload dir
            req.files[name].mv(`${CUR_DIR}/uploadDir/${req.files[name].name}`, function (err) {
                if (err)
                    return res.status(500);
                res
                    .status(200)
                    .send({
                        'timestamp': moment().unix(),
                    });
            });
        } else {
            res
                .status(406)
                .send({
                    message: 'Hash of the recieved file does not match recieved one \nCheck your connection or you may be hacked, be careful',
                    timestamp: moment().unix(),
                });
        }
    }
});


module.exports = router;
