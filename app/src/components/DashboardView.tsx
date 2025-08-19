import React from 'react';
import { Grid } from '@mui/material';
import MetricsCards from './MetricsCards';
import TaskTable from './TaskTable';
import { Task } from './types';

interface DashboardViewProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

const DashboardView = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus
}: DashboardViewProps) => {
  return (
    <Grid container spacing={3}>
      {/* Metrics Cards */}
      <Grid item xs={12}>
        <MetricsCards tasks={tasks} />
      </Grid>

      {/* Task Table */}
      <Grid item xs={12}>
        <TaskTable
          tasks={tasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleTaskStatus={onToggleTaskStatus}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardView;
