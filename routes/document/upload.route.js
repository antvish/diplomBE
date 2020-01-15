const express = require('express');
const File = require('../../db/file');
const hashValidator = require('../../helpers/document/hashValidation.helper');
const errors = require('../../helpers/errors');

const CUR_DIR = process.cwd();
const router = express.Router();

router.post('/upload', (req, res) => {
    let file = Object.values(req.files)[0];
    //Check if there is no file provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return res
            .status(400)
            .json({
                message: errors.NO_FILE_ERR,
                timestamp: Date.now(),
            });
    } else {
        //check hashsum of the recieved file
        //frontend should sent hashsum of file
        if (hashValidator.validateFileHash(req.body.hash, file.data)) {
            //Create object for the db
            const fileData = {
                name: req.files.document.name,
                hash: req.files.document.md5,
            };
            //Check if uploaded file already in db
            File
                .getFileByName(fileData.name)
                .then(file => {
                    //if file not found
                    if (!file) {
                        //insert file data in the db
                        File
                            .insertDocumentData(fileData);
                        //moving file to upload dir
                        req.files.document.mv(`${CUR_DIR}/uploadDir/${req.files.document.name}`, function (err) {
                            if (err)
                                return res.status(500);
                            res
                                .status(200)
                                .send({
                                    message: 'File was successfully uploaded',
                                    timestamp: Date.now(),
                                });
                        });
                        //if file name was found
                    } else {
                        //update file hash
                        File
                            .updateHash(fileData);
                        res
                            .status(200)
                            .send({
                                message: 'File hash was updated',
                                timestamp: Date.now(),
                            });

                    }
                });
        } else {
            res
                .status(406)
                .send({
                    message: errors.INCORR_HASH_ERR,
                    timestamp: Date.now(),
                });
        }
    }
});
module.exports = router;
