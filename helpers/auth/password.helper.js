module.exports = (password) => {
    return typeof password == 'string' &&
        password.trim() !== '' &&
        password.trim().length >= 6;
};
