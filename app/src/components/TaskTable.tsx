import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  DateRange as DateIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Task } from './types';
import { getStatusColor, getPriorityColor, getStatusIcon } from './utils';

interface TaskTableProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus
}) => {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Tareas</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={onAddTask}
          >
            Nueva Tarea
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Etiquetas</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Typography variant="subtitle1">{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(task.status)}
                      label={task.status}
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<DateIcon />}
                      label={task.dueDate}
                      color={new Date(task.dueDate) < new Date() && !task.completed ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CategoryIcon />}
                      label={task.category}
                      color="default"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {task.tags.map((tag, idx) => (
                      <Chip key={idx} label={tag} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => onEditTask(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onToggleTaskStatus(task.id)}>
                      <CompleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TaskTable;
