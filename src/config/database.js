const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'compasscar'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conexão ao banco de dados MySQL bem-sucedida!');
});

module.exports = db;
