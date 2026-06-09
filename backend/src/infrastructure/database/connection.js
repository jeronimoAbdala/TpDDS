require('dotenv').config();
const fs = require('fs');
const path = require('path');

const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
const dbPath = path.resolve(process.env.DB_PATH || './src/db/database.sqlite');

let _db;

const init = async () => {
  if (_db) return _db;
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();
  const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
  _db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
  _db.run('PRAGMA foreign_keys = ON');
  _db.run(schemaSQL);
  _persist();
  return _db;
};

const _persist = () => {
  const data = _db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
};

const run = (sql, params = []) => {
  _db.run(sql, params);
  const row = _get('SELECT last_insert_rowid() as id');
  _persist();
  return { lastInsertRowid: row ? Number(row.id) : null };
};

const _get = (sql, params = []) => {
  const stmt = _db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
};

const get = (sql, params = []) => _get(sql, params);

const all = (sql, params = []) => {
  const stmt = _db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

module.exports = { init, run, get, all };
