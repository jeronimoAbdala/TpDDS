require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createTables } = require('./db/schema');
const { errorHandler } = require('./middlewares/error.middleware');

const authRoutes        = require('./modules/auth/auth.routes');
const equiposRoutes     = require('./modules/equipos/equipos.routes');
const solicitudesRoutes = require('./modules/solicitudes/solicitudes.routes');

createTables();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/equipos',     equiposRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
}

module.exports = app;
