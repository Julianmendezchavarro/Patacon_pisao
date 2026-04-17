const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'patacon_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('MySQL conectado');
});

module.exports = connection;