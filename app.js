#!/usr/bin/env node
const express = require('express');
const auth = require('./auth/index');
const document = require('./document/upload');
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

app.use('/document', document);
app.use('/auth', auth);

app.use(function (req, res) {
    res.status(404).json('Looks like not found anything, maybe this is not the right url?')
});

app.use(function (err, req, res, next) {
    res.status(500).send('Oooops, something went wrong');
});

https
    .createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(port, (err) => {
        if (err) {
            return console.log('Server not started', err);
        }

        console.log(`Server is listening on port : ${port}`);
    });
