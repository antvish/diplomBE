# diplomBE

Для запуска node app.js

Миграции бд

knex migrate:latest

knex seed:run

Для создания сертификатов и ключей(просто как временная мера)

Сертификат - openssl req -nodes -new -x509 -keyout server.key -out server.cert
Ключи - https://travistidwell.com/jsencrypt/demo/
