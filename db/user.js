const knex = require('./connection');

//TODO вынести таблицы в конфиг
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
    getUserIdByLogin: function (login) {
        return knex('user')
            .where('login', login)
            .select('id')
            .then(id => {
                return id[0]
            });
    },
    updateFingerPrintByLogin: function (login, fingerPrint) {
        return knex('user')
            .where('login', login)
            .update({fingerprint: fingerPrint}, 'id')
            .then(id => {
                return id[0]
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
