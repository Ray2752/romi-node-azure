const mongoose = require('mongoose');

// URI de conexión de MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/romi-tasks-local';

// Configuración de conexión sin opciones deprecadas
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('✅ Conectado a MongoDB exitosamente');
  console.log(`📊 Base de datos: ${mongoose.connection.name}`);
  console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
})
.catch((err) => {
  console.error('❌ Error al conectar a MongoDB:', err.message);
  console.log('💡 Verificaciones sugeridas:');
  console.log('   - ¿Tu URI de MongoDB es correcta?');
  console.log('   - ¿Tienes conexión a internet?');
  console.log('   - ¿Las credenciales son válidas?');
  console.log('   - ¿El cluster de Atlas está activo?');
});

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔄 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado de MongoDB');
});

// Cerrar conexión cuando la aplicación termine
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Conexión MongoDB cerrada por terminación de la aplicación');
  process.exit(0);
});

module.exports = mongoose;
