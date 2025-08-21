import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Layout } from '../components/Layout/Layout';
import {
  StatCard,
  TotalTasksCard,
  CompletedTasksCard,
  PendingTasksCard,
  TaskProgressCard,
} from '../components/Dashboard/StatCard';
import { TaskCard } from '../components/Tasks/TaskCard';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  progress?: number;
  tags?: string[];
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks data
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

  // Recent tasks (last 5)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Upcoming deadlines
  const upcomingDeadlines = tasks
    .filter(task => task.dueDate && task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Good morning, Ray! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's what's happening with your projects today.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              }}
            >
              New Task
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TotalTasksCard count={totalTasks} change="+12%" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CompletedTasksCard count={completedTasks} change="+8%" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PendingTasksCard count={pendingTasks} change="-5%" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={inProgressTasks}
              change="+15%"
              icon={<TrendingUpIcon />}
              color="secondary"
              trend="up"
            />
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Task Progress */}
            <Box sx={{ mb: 3 }}>
              <TaskProgressCard completed={completedTasks} total={totalTasks} />
            </Box>

            {/* Recent Tasks */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Recent Tasks
                </Typography>
                <Grid container spacing={2}>
                  {recentTasks.slice(0, 4).map((task) => (
                    <Grid item xs={12} sm={6} key={task._id}>
                      <TaskCard
                        task={{
                          id: task._id,
                          title: task.title,
                          description: task.description,
                          status: task.status,
                          priority: task.priority,
                          dueDate: task.dueDate,
                          assignee: task.assignee || { name: 'Ray Admin' },
                          progress: Math.floor(Math.random() * 100), // Random progress for demo
                          tags: task.tags,
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Upcoming Deadlines */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Upcoming Deadlines
                </Typography>
                <List sx={{ p: 0 }}>
                  {upcomingDeadlines.map((task, index) => (
                    <React.Fragment key={task._id}>
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: task.priority === 'high' ? 'error.main' : 
                                             task.priority === 'medium' ? 'warning.main' : 'info.main',
                            }}
                          >
                            {task.title.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {task.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={task.priority}
                                size="small"
                                color={task.priority === 'high' ? 'error' : 
                                      task.priority === 'medium' ? 'warning' : 'info'}
                                sx={{ fontSize: '0.7rem' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Soon'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < upcomingDeadlines.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <List sx={{ p: 0 }}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: 'success.main' }}>
                        ✓
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Task completed"
                      secondary="Website redesign finished"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: 'primary.main' }}>
                        +
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="New task created"
                      secondary="Mobile app development"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: 'warning.main' }}>
                        !
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Deadline approaching"
                      secondary="Project review due tomorrow"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};
