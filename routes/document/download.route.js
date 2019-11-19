const express = require('express');

const CUR_DIR = process.cwd();
const router = express.Router();

router.get('/download', (req, res) => {
    const file = `${CUR_DIR}/uploadDir/_AenAmCEn4A.jpg`;
    res.download(file, '_AenAmCEn4A.jpg', (err) => {
        if (err) {
            res
                .status(500)
                .send('Oooops, something went wrong while downloading');
        } else {
            res
                .status(200)
        }
    });
});

module.exports = router;
