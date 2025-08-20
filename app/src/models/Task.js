const mongoose = require('mongoose');

// Esquema para las tareas
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date >= new Date();
      },
      message: 'La fecha de vencimiento debe ser futura'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  assignedTo: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para actualizar updatedAt antes de cada save
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Métodos del esquema
taskSchema.methods.markAsCompleted = function() {
  this.status = 'completed';
  return this.save();
};

taskSchema.methods.markAsInProgress = function() {
  this.status = 'in-progress';
  return this.save();
};

// Índices para optimizar consultas
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
