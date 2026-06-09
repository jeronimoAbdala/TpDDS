require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { init } = require('./infrastructure/database/connection');
const { errorHandler } = require('./presentation/middlewares/error.middleware');
const authRoutes        = require('./presentation/routes/auth.routes');
const equiposRoutes     = require('./presentation/routes/equipos.routes');
const solicitudesRoutes = require('./presentation/routes/solicitudes.routes');

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth',        authRoutes);
  app.use('/api/equipos',     equiposRoutes);
  app.use('/api/solicitudes', solicitudesRoutes);
  app.use(errorHandler);
  return app;
};

const start = async () => {
  await init();
  const app = createApp();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
};

if (require.main === module) start();

module.exports = { createApp, start };
