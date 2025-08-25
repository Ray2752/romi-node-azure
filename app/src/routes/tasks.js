const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, limit = 50, page = 1 } = req.query;
    

    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (category) filters.category = category;
    

    const skip = (page - 1) * limit;
    
    const tasks = await Task.find(filters)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
      
    const total = await Task.countDocuments(filters);
    
    res.json({
      success: true,
      data: tasks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: tasks.length,
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
});
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
});
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Debe ser: pending, in-progress, o completed'
      });
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: `Estado actualizado a: ${status}`,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado',
      error: error.message
    });
  }
});
router.get('/stats/summary', async (req, res) => {
  try {
    const [
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      highPriorityTasks
    ] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: 'pending' }),
      Task.countDocuments({ status: 'in-progress' }),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ priority: 'high' })
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
        highPriority: highPriorityTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;
