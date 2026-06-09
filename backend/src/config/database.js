const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(process.env.DB_PATH || './src/db/database.json');
const adapter = new FileSync(dbPath);
const db = low(adapter);

db.defaults({
  usuarios:              [],
  equipos:               [],
  solicitudes:           [],
  historial_solicitudes: [],
}).write();

module.exports = db;
