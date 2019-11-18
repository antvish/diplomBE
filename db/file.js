const knex = require('./connection');

module.exports = {
    getFileByName: function (name) {
        return knex('documents')
            .where('name', name)
            .first();
    },
    insertDocumentData: function (file) {
        return knex('documents')
            .insert(file, 'id')
            .then(ids => {
                return ids[0];
            });
    },
    getHashByName(fileName) {
        return knex('documents')
            .where('name', fileName)
            .select('hash')
            .then(hash => {
                return hash[0].hash;
            });
    },
    updateHash(file) {
        return knex('documents')
            .where({'name': file.name})
            .update({'hash': file.hash}, 'id')
            .then(id => {
                return id[0];
            });
    }
};
