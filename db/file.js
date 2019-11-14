const knex = require('./connection');

module.exports = {
    getOne: function (id) {
        return knex('file').where('id', id).first();
    },
    getOneByName: function (name) {
        return knex('file').where('name', name).first();
    },
    getHashByName: function (name) {
        return knex('file').where('name', name);
    },
    insertHash: function (hash) {
        return knex('file').insert({hash: hash})
    }
};
