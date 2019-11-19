#!/usr/bin/env node
const express = require('express');
const signup = require('./routes/user/signup.route');
const login = require('./routes/user/login.route');
const upload = require('./routes/document/upload.route');
const download = require('./routes/document/download.route');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');
const middleware = require('./middleware/auth/checkToken.middleware');

const app = express();
const port = 3000;

app.use(fileUpload());
app.use(bodyParser.json({}));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/user', signup);
app.use('/user', login);
app.use('/', middleware.checkToken);
app.use('/document', upload);
app.use('/document', download);

app.use(function (req, res) {
    res.status(404).json('Looks like not found anything, maybe this is not the right url?')
});

app.use(function (err, req, res, next) {
    res.status(500).json('Oooops, something went wrong');
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
