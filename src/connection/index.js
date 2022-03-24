const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user:'root',
        password:'',
        host:'localhost',
        database:'project_hris_db',
        port:3306
        
        // host:'us-cdbr-east-03.cleardb.com',
        // user:'bb9c2f6d9ed352',
        // password:'a768e645',
        // database:'heroku_94e0f5b406e00d0'
    }
)

module.exports = conn