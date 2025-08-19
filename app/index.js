const express = require('express');
const app = express();
const port = process.env.PORT || process.env.WEBSITES_PORT || 8080;

console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('WEBSITES_PORT:', process.env.WEBSITES_PORT);
console.log('Using port:', port);

// Middleware
app.use(express.json());

// In-memory storage (en producción usarías una DB)
let tasks = [
  { id: 1, title: 'Completar reto técnico', description: 'Implementar infraestructura en Azure', status: 'completed', createdAt: new Date().toISOString() },
  { id: 2, title: 'Mejorar la aplicación', description: 'Agregar funcionalidades REST API', status: 'in-progress', createdAt: new Date().toISOString() }
];
let nextId = 3;

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 ROMI Task Manager API - Deployment exitoso!',
    version: '1.0.0',
    endpoints: {
      'GET /': 'API info',
      'GET /api/tasks': 'Obtener todas las tareas',
      'GET /api/tasks/:id': 'Obtener tarea por ID',
      'POST /api/tasks': 'Crear nueva tarea',
      'PUT /api/tasks/:id': 'Actualizar tarea',
      'DELETE /api/tasks/:id': 'Eliminar tarea',
      'GET /api/health': 'Health check'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  const { status } = req.query;
  let filteredTasks = tasks;
  
  if (status) {
    filteredTasks = tasks.filter(task => task.status === status);
  }
  
  res.json({
    success: true,
    count: filteredTasks.length,
    data: filteredTasks
  });
});

// Get task by ID
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  
  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada'
    });
  }
  
  res.json({
    success: true,
    data: task
  });
});

// Create new task
app.post('/api/tasks', (req, res) => {
  const { title, description, status = 'pending' } = req.body;
  
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'El título es requerido'
    });
  }
  
  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Tarea creada exitosamente',
    data: newTask
  });
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada'
    });
  }
  
  const { title, description, status } = req.body;
  
  if (title) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (status) tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Tarea actualizada exitosamente',
    data: tasks[taskIndex]
  });
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Tarea no encontrada'
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Tarea eliminada exitosamente',
    data: deletedTask
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 ROMI Task Manager API corriendo en http://0.0.0.0:${port}`);
  console.log(`📋 Total de tareas iniciales: ${tasks.length}`);
});
