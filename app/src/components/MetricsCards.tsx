import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography
} from '@mui/material';
import {
  Assignment as TaskIcon,
  CheckCircle as CompleteIcon,
  PlayArrow as InProgressIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import { Task } from './types';

interface MetricsCardsProps {
  tasks: Task[];
}

const MetricsCards = ({ tasks }: MetricsCardsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => 
    new Date(task.dueDate) < new Date() && !task.completed
  ).length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TaskIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {totalTasks}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Total de Tareas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CompleteIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {completedTasks}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Completadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <InProgressIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {inProgressTasks}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  En Progreso
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <PriorityIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {overdueTasks}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Vencidas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MetricsCards;
