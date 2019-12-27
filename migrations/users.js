const knex = require('../db/connection');

module.exports = {
    up: function () {
        return knex
            .schema
            .createTable('aaaa', function (table) {
                table.increments();
                table.string('login', 512).unique().notNullable();
                table.string('password', 512).notNullable();
                table.string('two_step_token', 20);
                table.string('user_agent', 20);
                table.string('user_ip', 20).unique().notNullable();
                table.string('refresh_token', 512);
                table.string('access_token', 512);
            });
    },
    down: function () {
        return knex.schema.dropTableIfExists('aaaa');
    },
};
