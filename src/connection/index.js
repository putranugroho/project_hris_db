const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user:'putranugroho',
        password:'86604550',
        host:'db4free.net',
        database:'mysqlputra',
        port:3306
    }
)

module.exports = conn