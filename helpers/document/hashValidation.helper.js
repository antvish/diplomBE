const crypto = require('crypto');

let checkSum = (str, algorithm, encoding) => {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
};

let validateFileHash = (hash, file) => {
    return checkSum(file) === hash;
};

module.exports = {
    validateFileHash: validateFileHash
};
