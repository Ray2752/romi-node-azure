const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde el directorio build
app.use(express.static(path.join(__dirname, 'build')));

// Para todas las rutas, servir index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Puerto configurado por Azure o 3001 por defecto
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 ROMI AI Frontend Server running on port ${port}`);
  console.log(`📱 App URL: http://localhost:${port}`);
});

module.exports = app;
