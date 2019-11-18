const knex = require('./connection');

module.exports = {
    getOne: function (id) {
        return knex('user')
            .where('id', id)
            .first();
    },
    getUserByLogin: function (login) {
        return knex('user')
            .where('login', login)
            .first();
    },
    getUserFingerPrint: function (login) {
        return knex('user')
            .where('login', login)
            .first()
            .then(fingerPrint => {
                return fingerPrint.fingerprint();
            })
    },
    gerUserIp: function (login) {
        return knex('user')
            .where('login', login)
            .first()
            .then(ip => {
                return ip.userIp();
            })
    },
    updateUserFingerPrint: function (login, fingerPrint) {
        return knex('user')
            .where('login', login)
            .update({fingerprint: fingerPrint}, 'id')
            .then(id => {
                return id;
            });
    },
    create: function (user) {
        return knex('user')
            .insert(user, 'id')
            .then(ids => {
                return ids[0];
            });
    }
};
