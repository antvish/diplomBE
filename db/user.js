const knex = require('./connection');

module.exports = {
    getOne: function (id) {
        return knex('user').where('id', id).first();
    },
    getOneByLogin: function (email) {
        return knex('user').where('login', login).first();
    }
};
