const express = require('express');
const moment = require('moment');
const File = require('../../db/file');
const hashValidator = require('../../helpers/document/hashValidation.helper');

const CUR_DIR = process.cwd();
const router = express.Router();

router.post('/upload', (req, res) => {
    let name = req.body.fileName;
    //Check if there is no file provided
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Looks like you did not provide any file');
    } else {

        //check hashsum of the recieved file
        if (hashValidator.validateFileHash(req.files[name].md5, req.files[name].data)) {
            //Create object for the db
            const fileData = {
                name: req.files[name].name,
                hash: req.files[name].md5,
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
                        req.files[name].mv(`${CUR_DIR}/uploadDir/${req.files[name].name}`, function (err) {
                            if (err)
                                return res.status(500);
                            res
                                .status(200)
                                .send({
                                    'timestamp': moment().unix(),
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
                                'message': 'File hash was updated',
                                'timestamp': moment().unix(),
                            });

                    }
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
