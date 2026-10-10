const mysql = require('mysql2/promise');
const { getConfig } = require('./config');

function createPool() {
  const { db } = getConfig();
  return mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
    waitForConnections: true,
    connectionLimit: 5,
  });
}

module.exports = { createPool };
