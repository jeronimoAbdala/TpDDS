const db = require('../config/database');

// Genera el próximo ID numérico para una colección dada
const nextId = (coleccion) => {
  const items = db.get(coleccion).value();
  return items.length ? Math.max(...items.map((r) => r.id)) + 1 : 1;
};

module.exports = nextId;
