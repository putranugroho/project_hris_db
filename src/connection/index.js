const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        // user:'root',
        // password:'',
        // host:'localhost',
        // database:'project_hris_db',
        // port:3306
        
        host:'us-mm-auto-dca-05-b.cleardb.net',
        user:'bb9c2f6d9ed352',
        password:'a768e645',
        database:'heroku_94e0f5b406e00d0',
        port:3306
    }
)

module.exports = conn