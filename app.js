#!/usr/bin/env node
const express = require('express');
const auth = require('./auth/index');
const document = require('./file/upload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(bodyParser.json({}));
app.use(cookieParser(process.env.COOKIE_SECRET));

console.log('here');
app.use('/document', document);
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

app.use(function (req, res, next) {
    let err = new Error('Ooops, looks like not found anything, maybe u wanna try some more? :)');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.json({
        message: req.app.get('env') !== 'production' ? err.message : 'Ooops, something went wrong',
        error: req.app.get('env') === 'development' ? err : {}
    });
});

https
    .createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, (err) => {
        if (err) {
            return console.log('Oops, server not started', err);
        }

        console.log(`server is listening on port : ${port}`);
    });
