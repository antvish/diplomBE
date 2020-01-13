const knex = require('../db/connection');

module.exports = {
    up: function () {
        return knex
            .schema
            .createTable('documents', function (table) {
                table.increments();
                table.string('name', 512);
                table.string('hash', 512);
            });
    },
    down: function () {
        return knex.schema.dropTableIfExists('documents');
    },
};
