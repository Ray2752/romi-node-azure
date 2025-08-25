
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();
let connectMongo;
try {
  ({ connectMongo } = require('./src/bd/mongo_connection'));
} catch {

  require('./src/bd/mongo_connection');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
const taskRoutes = require('./src/routes/tasks');
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ROMI Task Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});
const buildDir = path.join(__dirname, 'build');
const hasBuild = fs.existsSync(path.join(buildDir, 'index.html'));

if (hasBuild) {

  app.use(express.static(buildDir));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {

  app.get('/', (_req, res) => {
    res.status(200).send(
      '⚠️ No se encontró /build/index.html. Asegúrate de ejecutar el build del frontend antes del despliegue.'
    );
  });
}
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error:
      process.env.NODE_ENV === 'development'
        ? err?.message || String(err)
        : 'Something went wrong',
  });
});

const port = Number(process.env.PORT) || 3001;
const host = '0.0.0.0';
(async () => {
  if (typeof connectMongo === 'function') {
    try {
      await connectMongo();
    } catch (e) {
      console.error(
        '⚠️ No fue posible conectar a MongoDB al arranque:',
        e?.message || e
      );
    }
  }
})();

app.listen(port, host, () => {
  console.log(`🚀 ROMI Task Manager Server running on http://${host}:${port}`);
  console.log(`🔗 API URL: http://localhost:${port}/api`);
  console.log(`📊 Health Check: http://localhost:${port}/api/health`);
});

module.exports = app;
