module.exports = {
    secret: '1 ',
    jwtConfig: {
        expiresIn: '1h',
        algorithm: 'RS256',
    },
    cookieConf: {
        expires: new Date(Date.now() + 1 * 3600000), // cookie expires after 1 hours
        secure: true, //cookie used with https only
        sameSite: true, //cookie is not to be sent along with cross-site requests
        httpOnly: true, //cookie is accessible only by web server
    },
};
