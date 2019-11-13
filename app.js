#!/usr/bin/env node
const express = require('express');
const app = express();
const auth = require('./auth/index');
const file = require('./file/upload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const port = 3000;

app.use(fileUpload());
app.use(bodyParser.json({}));
app.use(cookieParser(process.env.COOKIE_SECRET));

console.log('here');
app.use('/file', file);
app.use('/auth', auth);

// app.get('/salt', (request, response) => {
//     crypto.randomBytes(16, (err, buff) => {
//         if (err) return response.status(500).send('Internal server error');
//         response.json({
//             salt: buff.toString('hex'),
//         })
//     })
// });
//

app.use(function(req, res, next) {
    let err = new Error('Ooops, looks like not found anything, maybe u wanna try some more? :)');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: req.app.get('env') !== 'production' ? err.message : 'Ooops, something went wrong',
        error: req.app.get('env') === 'development' ? err : {}
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Oops, server not started', err);
    }

    console.log(`server is listening on port : ${port}`);
});
