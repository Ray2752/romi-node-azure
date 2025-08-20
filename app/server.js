const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Inicializar conexión a MongoDB
require('./src/bd/mongo_connection');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
const taskRoutes = require('./src/routes/tasks');
app.use('/api/tasks', taskRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'ROMI Task Manager API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir archivos estáticos desde el directorio build
app.use(express.static(path.join(__dirname, 'build')));

// Para todas las rutas que no son API, servir index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Puerto configurado por Azure o 3001 por defecto
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 ROMI Task Manager Server running on port ${port}`);
  console.log(`📱 Frontend URL: http://localhost:${port}`);
  console.log(`🔗 API URL: http://localhost:${port}/api`);
  console.log(`📊 Health Check: http://localhost:${port}/api/health`);
});

module.exports = app;
