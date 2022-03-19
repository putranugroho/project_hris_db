const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user:'root',
        password:'',
        host:'localhost',
        database:'project_hris_db',
        port:3306
    }
)

module.exports = conn