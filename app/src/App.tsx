import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  IconButton,
  Alert,
  Menu,
  Badge,
  MenuItem,
  Chip,
  Grid,
  Snackbar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

// Components
import DashboardView from './components/DashboardView';
import NavigationDrawer from './components/NavigationDrawer';
import TaskDialog from './components/TaskDialog';

// Types and Utils
import { Task, TaskFormData } from './components/types';

function App() {
  // State Management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form state for new/edit task
  const [taskForm, setTaskForm] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: '',
    dueDate: '',
    tags: []
  });

  // Initialize demo data
  useEffect(() => {
    const demoTasks: Task[] = [
      {
        id: '1',
        title: 'Diseñar interfaz de usuario',
        description: 'Crear mockups y prototipos para la nueva aplicación web',
        status: 'in-progress',
        priority: 'high',
        category: 'Diseño',
        dueDate: '2025-08-25',
        completed: false,
        createdAt: '2025-08-15',
        tags: ['UI/UX', 'Figma', 'Frontend']
      },
      {
        id: '2',
        title: 'Configurar base de datos',
        description: 'Instalar y configurar PostgreSQL con las tablas necesarias',
        status: 'completed',
        priority: 'urgent',
        category: 'Backend',
        dueDate: '2025-08-20',
        completed: true,
        createdAt: '2025-08-10',
        tags: ['Database', 'PostgreSQL', 'Backend']
      },
      {
        id: '3',
        title: 'Escribir documentación',
        description: 'Documentar la API REST y crear guías de usuario',
        status: 'todo',
        priority: 'medium',
        category: 'Documentación',
        dueDate: '2025-08-30',
        completed: false,
        createdAt: '2025-08-18',
        tags: ['Docs', 'API', 'Manual']
      },
      {
        id: '4',
        title: 'Pruebas unitarias',
        description: 'Implementar suite completa de tests para componentes React',
        status: 'todo',
        priority: 'high',
        category: 'Testing',
        dueDate: '2025-08-28',
        completed: false,
        createdAt: '2025-08-16',
        tags: ['Testing', 'Jest', 'React']
      },
      {
        id: '5',
        title: 'Optimizar rendimiento',
        description: 'Revisar y mejorar el tiempo de carga de la aplicación',
        status: 'in-progress',
        priority: 'medium',
        category: 'Performance',
        dueDate: '2025-09-05',
        completed: false,
        createdAt: '2025-08-12',
        tags: ['Performance', 'Optimization', 'Frontend']
      }
    ];

    setTasks(demoTasks);
  }, []);

  // Task Management Functions
  const handleAddTask = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: '',
      dueDate: '',
      tags: []
    });
    setOpenTaskDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate,
      tags: task.tags
    });
    setOpenTaskDialog(true);
  };

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) {
      setSnackbarMessage('El título es obligatorio');
      setSnackbarOpen(true);
      return;
    }

    if (editingTask) {
      // Edit existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { 
              ...task, 
              ...taskForm,
              completed: taskForm.status === 'completed'
            }
          : task
      ));
      setSnackbarMessage('Tarea actualizada exitosamente');
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskForm,
        completed: taskForm.status === 'completed',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setTasks(prev => [...prev, newTask]);
      setSnackbarMessage('Tarea creada exitosamente');
    }

    setOpenTaskDialog(false);
    setSnackbarOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSnackbarMessage('Tarea eliminada');
    setSnackbarOpen(true);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          completed: newStatus === 'completed'
        };
      }
      return task;
    }));
  };

  const handleFormChange = (field: keyof TaskFormData, value: any) => {
    setTaskForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <DashboardIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📝 Task Manager
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountIcon />
          </IconButton>

          <Chip 
            label="v1.0" 
            color="secondary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <NavigationDrawer
        open={drawerOpen}
        currentView={currentView}
        onClose={() => setDrawerOpen(false)}
        onViewChange={setCurrentView}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4, flexGrow: 1 }}>
        {/* Welcome Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>¡Bienvenido a Task Manager!</strong> Organiza y gestiona tus tareas de manera eficiente.
        </Alert>

        {/* Content based on current view */}
        {currentView === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        )}
        
        {currentView === 'tasks' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Gestión de Tareas</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Vista completa de todas tus tareas
              </Typography>
            </CardContent>
          </Card>
        )}

        {currentView === 'categories' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Categorías</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Organiza tus tareas por categorías
              </Typography>
            </CardContent>
          </Card>
        )}

        {currentView === 'settings' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Configuración</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Personaliza tu experiencia de usuario
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          backgroundColor: 'grey.100',
          mt: 'auto'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                © 2025 Task Manager - Gestión Personal de Tareas
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={1}>
                <Chip label="React App" color="info" size="small" />
                <Chip label="Material-UI" color="success" size="small" />
                <Chip label="TypeScript" color="primary" size="small" />
                <Chip label="Responsive" color="warning" size="small" />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>Mi Perfil</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Configuración</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Cerrar Sesión</MenuItem>
      </Menu>

      {/* Task Dialog */}
      <TaskDialog
        open={openTaskDialog}
        editingTask={editingTask}
        taskForm={taskForm}
        onClose={() => setOpenTaskDialog(false)}
        onSave={handleSaveTask}
        onFormChange={handleFormChange}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}

export default App;
