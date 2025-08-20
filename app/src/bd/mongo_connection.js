// src/bd/mongo_connection.js
const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/romi-tasks-local';

let connecting = null;

async function connectMongo({
  retries = 8,
  initialDelayMs = 1000, // 1s
  maxDelayMs = 30000     // 30s
} = {}) {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  if (connecting) return connecting;

  const attempt = async () => {
    let delay = initialDelayMs;
    for (let i = 1; i <= retries; i++) {
      try {
        await mongoose.connect(MONGO_URI, {
          // Opcionales: ajusta si te hace falta
          // serverSelectionTimeoutMS: 10000,
          // retryWrites: true,
          // w: 'majority',
        });
        console.log('✅ Conectado a MongoDB');
        console.log(`📊 DB: ${mongoose.connection.name}`);
        console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
        return mongoose;
      } catch (err) {
        const message = err?.message || String(err);
        console.error(`❌ Intento ${i}/${retries} fallido para MongoDB: ${message}`);
        if (i === retries) {
          console.error('⛔ Se agotaron los reintentos de conexión a MongoDB.');
          throw err; // deja que el caller decida qué hacer
        }
        await new Promise(r => setTimeout(r, delay));
        delay = Math.min(delay * 2, maxDelayMs); // backoff exponencial
      }
    }
  };

  connecting = attempt().finally(() => (connecting = null));
  return connecting;
}

// Eventos útiles (no hacen salir al proceso)
mongoose.connection.on('connected', () => {
  console.log('🔄 Mongoose conectado');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err?.message || err);
});
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado');
});

// Cierre ordenado
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Conexión MongoDB cerrada por SIGINT');
  process.exit(0);
});

module.exports = { mongoose, connectMongo };
