// Update with your config settings.

require('dotenv').config();

module.exports = {

    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'kek',
            password: '1234',
            database: 'postgres',
        }

    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL + '?ssl=true'
    }

};
