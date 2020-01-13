#!/usr/bin/env node
const express = require('express');
const signup = require('./routes/user/signup.route');
const login = require('./routes/user/login.route');
const refreshToken = require('./routes/user/refreshToken.route');
const upload = require('./routes/document/upload.route');
const download = require('./routes/document/download.route');
const logout = require('./routes/user/logout.route');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');
const middleware = require('./middleware/auth/checkToken.middleware');
const errors = require('./helpers/errors');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(fileUpload());
app.use(bodyParser.json({}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());

app.use('/user', signup);
app.use('/user', login);
app.use('/user', refreshToken);
app.use('/', middleware.checkToken);
app.use('/user', logout);
app.use('/document', upload);
app.use('/document', download);

//error handling
app.use(function (req, res) {
    res
        .status(404)
        .json({
            error: errors.ERR_404,
            timestamp: Date.now()
        });
});
app.use(function (err, req, res, next) {
    res
        .status(500)
        .json({
            error: errors.ERR_500,
            timestamp: Date.now()
        });
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
