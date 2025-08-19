import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Task, TaskFormData } from './types';

interface TaskDialogProps {
  open: boolean;
  editingTask: Task | null;
  taskForm: TaskFormData;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: keyof TaskFormData, value: any) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  editingTask,
  taskForm,
  onClose,
  onSave,
  onFormChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título"
              value={taskForm.title}
              onChange={(e) => onFormChange('title', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={3}
              value={taskForm.description}
              onChange={(e) => onFormChange('description', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={taskForm.status}
                onChange={(e) => onFormChange('status', e.target.value as Task['status'])}
              >
                <MenuItem value="todo">Por Hacer</MenuItem>
                <MenuItem value="in-progress">En Progreso</MenuItem>
                <MenuItem value="completed">Completada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={taskForm.priority}
                onChange={(e) => onFormChange('priority', e.target.value as Task['priority'])}
              >
                <MenuItem value="low">Baja</MenuItem>
                <MenuItem value="medium">Media</MenuItem>
                <MenuItem value="high">Alta</MenuItem>
                <MenuItem value="urgent">Urgente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Categoría"
              value={taskForm.category}
              onChange={(e) => onFormChange('category', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Vencimiento"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => onFormChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave} variant="contained">
          {editingTask ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
