// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// Conexión a MongoDB con backoff (usa la versión que te pasé)
let connectMongo;
try {
  ({ connectMongo } = require('./src/bd/mongo_connection'));
} catch {
  // fallback si aún no actualizas mongo_connection.js
  require('./src/bd/mongo_connection');
}

const app = express();

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging sencillo
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ---------- Rutas API ---------- */
const taskRoutes = require('./src/routes/tasks');
app.use('/api/tasks', taskRoutes);

// Health check (no bloquea por Mongo)
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'ROMI Task Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/* ---------- Static / SPA ---------- */
const buildDir = path.join(__dirname, 'build');
const hasBuild = fs.existsSync(path.join(buildDir, 'index.html'));

if (hasBuild) {
  // Servir archivos estáticos del frontend
  app.use(express.static(buildDir));

  // SPA fallback: sólo para rutas que no empiezan con /api
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {
  // Mensaje útil si aún no existe el build (evita errores en Azure)
  app.get('/', (_req, res) => {
    res.status(200).send(
      '⚠️ No se encontró /build/index.html. Asegúrate de ejecutar el build del frontend antes del despliegue.'
    );
  });
}

/* ---------- Manejo de errores ---------- */
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

/* ---------- Arranque ---------- */
// Azure establece PORT (normalmente 8080). En local usa 3001 si no está definido.
const port = Number(process.env.PORT) || 3001;
const host = '0.0.0.0';

// Conecta a Mongo en background (no bloquea el arranque)
(async () => {
  if (typeof connectMongo === 'function') {
    try {
      await connectMongo(); // reintenta con backoff
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
