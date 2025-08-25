import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  useTheme,
  createTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  Link as LinkIcon,
  Comment as CommentIcon,
  Alarm as ReminderIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
  Tooltip,
} from 'recharts';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface NewTask {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: string;
  tags?: string[];
}

const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '';

const forceProduction = !isLocalhost || window.location.protocol === 'https:';

const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (isLocalhost && !forceProduction
    ? 'http://localhost:3001/api'
    : '/api');

console.log('Window location:', window.location.href);
console.log('Hostname:', window.location.hostname);
console.log('Protocol:', window.location.protocol);
console.log('Is localhost:', isLocalhost);
console.log('Force production:', forceProduction);
console.log('Environment:', process.env.NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('Custom API URL:', process.env.REACT_APP_API_URL);

const taskAPI = {

  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Error al obtener tareas');
      const result = await response.json();
      const data = result.data || result;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error en getTasks:', error);
      return [];
    }
  },

  createTask: async (task: NewTask): Promise<Task | null> => {
    try {
      console.log('Creating task with URL:', `${API_BASE_URL}/tasks`);
      console.log('Task data:', task);
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        

        let errorMessage = 'Error al crear la tarea';
        
        if (errorData) {
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
          

          if (errorMessage.includes('fecha de vencimiento debe ser futura')) {
            errorMessage = 'La fecha de vencimiento debe ser en el futuro';
          } else if (errorMessage.includes('título es requerido')) {
            errorMessage = 'El título de la tarea es requerido';
          } else if (errorMessage.includes('validation')) {
            errorMessage = 'Los datos de la tarea no son válidos. Verifica la información ingresada.';
          }
        }
        

        const showSnackbar = (message: string, severity: 'success' | 'error') => {

          console.error('Server error:', message);
        };
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Create task result:', result);

      return result.data || result;
    } catch (error) {
      console.error('Error en createTask:', error);
      

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica tu conexión a internet.');
      }
      

      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error inesperado al crear la tarea');
    }
  },
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    try {
      console.log('Updating task:', id, 'with data:', updates);
      
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Update error response:', errorData);
        
        let errorMessage = 'Error al actualizar la tarea';
        
        if (errorData) {
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(', ');
          }
          

          if (errorMessage.includes('fecha de vencimiento debe ser futura')) {
            errorMessage = 'La fecha de vencimiento debe ser en el futuro';
          } else if (errorMessage.includes('not found')) {
            errorMessage = 'La tarea no existe o fue eliminada';
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Update task result:', result);
      return result.data || result;
    } catch (error) {
      console.error('Error en updateTask:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica tu conexión a internet.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error inesperado al actualizar la tarea');
    }
  },
  deleteTask: async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting task:', id);
      
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Delete error response:', errorData);
        
        let errorMessage = 'Error al eliminar la tarea';
        
        if (response.status === 404) {
          errorMessage = 'La tarea no existe o ya fue eliminada';
        } else if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
        
        throw new Error(errorMessage);
      }
      
      console.log('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error en deleteTask:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica tu conexión a internet.');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Error inesperado al eliminar la tarea');
    }
  },
  healthCheck: async (): Promise<boolean> => {
    try {
      console.log('Testing API health at:', `${API_BASE_URL}/health`);
      const response = await fetch(`${API_BASE_URL}/health`);
      console.log('Health check response:', response.status, response.ok);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};
const octomTheme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: 'none',
        },
      },
    },
  },
});

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('Monthly');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  

  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: '',
    dueDate: '',
    tags: [],
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  

  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {

    const initializeApp = async () => {
      console.log('Initializing app...');
      const apiHealthy = await taskAPI.healthCheck();
      console.log('API healthy:', apiHealthy);
      
      if (apiHealthy) {
        await loadTasks();
      } else {
        console.error('API no está disponible');
        setSnackbar({ 
          open: true, 
          message: 'No se puede conectar al servidor. Verifica tu conexión.', 
          severity: 'error' 
        });
        setLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  useEffect(() => {
  }, [tasks, activeTab]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await taskAPI.getTasks();

      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      } else {
        console.warn('Las tareas no son un array:', fetchedTasks);
        setTasks([]);
      }
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      setTasks([]);
      showSnackbar('Error al cargar las tareas', 'error');
    }
    setLoading(false);
  };
  const handleCreateTask = async () => {

    const validationError = validateTaskData(newTask);
    if (validationError) {
      showSnackbar(validationError, 'error');
      return;
    }
    const taskData: any = {
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      status: newTask.status,
      priority: newTask.priority,
    };
    if (newTask.category?.trim()) {
      taskData.category = newTask.category.trim();
    }

    if (newTask.dueDate?.trim()) {
      taskData.dueDate = newTask.dueDate.trim();
    }

    if (newTask.tags && newTask.tags.length > 0) {
      taskData.tags = newTask.tags;
    }

    console.log('Sending task data:', taskData);

    try {
      const createdTask = await taskAPI.createTask(taskData);
      if (createdTask) {
        setTasks(prev => [...prev, createdTask]);
        resetNewTask();
        setOpenTaskDialog(false);
        showSnackbar('Tarea creada exitosamente', 'success');
      } else {
        showSnackbar('No se pudo crear la tarea. Intenta nuevamente.', 'error');
      }
    } catch (error) {

      const errorMessage = error instanceof Error ? error.message : 'Error al crear la tarea';
      showSnackbar(errorMessage, 'error');
    }
  };
  const validateTaskData = (task: NewTask): string | null => {
    if (!task.title.trim()) {
      return 'El título es requerido';
    }

    if (task.title.trim().length > 100) {
      return 'El título no puede tener más de 100 caracteres';
    }

    if (task.description.length > 500) {
      return 'La descripción no puede tener más de 500 caracteres';
    }

    if (task.category && task.category.length > 50) {
      return 'La categoría no puede tener más de 50 caracteres';
    }

    if (task.dueDate?.trim()) {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      
      if (isNaN(dueDate.getTime())) {
        return 'La fecha de vencimiento no es válida';
      }

      if (dueDate <= now) {
        return 'La fecha de vencimiento debe ser en el futuro';
      }
    }

    return null;
  };
  const validateField = (fieldName: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'El título es requerido';
        } else if (value.trim().length > 100) {
          errors.title = 'El título no puede tener más de 100 caracteres';
        } else {
          delete errors.title;
        }
        break;
        
      case 'description':
        if (value.length > 500) {
          errors.description = 'La descripción no puede tener más de 500 caracteres';
        } else {
          delete errors.description;
        }
        break;
        
      case 'category':
        if (value.length > 50) {
          errors.category = 'La categoría no puede tener más de 50 caracteres';
        } else {
          delete errors.category;
        }
        break;
        
      case 'dueDate':
        if (value.trim()) {
          const dueDate = new Date(value);
          const now = new Date();
          
          if (isNaN(dueDate.getTime())) {
            errors.dueDate = 'La fecha de vencimiento no es válida';
          } else if (dueDate <= now) {
            errors.dueDate = 'La fecha de vencimiento debe ser en el futuro';
          } else {
            delete errors.dueDate;
          }
        } else {
          delete errors.dueDate;
        }
        break;
    }
    
    setValidationErrors(errors);
  };
  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskAPI.updateTask(id, updates);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
        showSnackbar('Tarea actualizada exitosamente', 'success');
      } else {
        showSnackbar('No se pudo actualizar la tarea. Intenta nuevamente.', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la tarea';
      showSnackbar(errorMessage, 'error');
    }
  };
  const handleDeleteTask = async (id: string) => {
    try {

      if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
      }

      const success = await taskAPI.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task._id !== id));
        showSnackbar('Tarea eliminada exitosamente', 'success');
      } else {
        showSnackbar('No se pudo eliminar la tarea. Intenta nuevamente.', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la tarea';
      showSnackbar(errorMessage, 'error');
    }
  };
  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    await handleUpdateTask(taskId, { status: newStatus });
  };
  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: '',
      dueDate: '',
      tags: [],
    });
    setValidationErrors({});
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category || '',
      dueDate: task.dueDate || '',
      tags: task.tags || [],
    });
    setOpenTaskDialog(true);
  };

  const handleSaveTask = async () => {
    if (editingTask) {
      await handleUpdateTask(editingTask._id, newTask);
      setEditingTask(null);
    } else {
      await handleCreateTask();
    }
  };

  const handleCloseDialog = () => {
    setOpenTaskDialog(false);
    setEditingTask(null);
    resetNewTask();
  };
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.status.toLowerCase().includes(searchLower) ||
      task.priority.toLowerCase().includes(searchLower) ||
      (task.category && task.category.toLowerCase().includes(searchLower))
    );
  }) : [];
  const stats = {
    total: Array.isArray(filteredTasks) ? filteredTasks.length : 0,
    pending: Array.isArray(filteredTasks) ? filteredTasks.filter(t => t.status === 'pending').length : 0,
    inProgress: Array.isArray(filteredTasks) ? filteredTasks.filter(t => t.status === 'in-progress').length : 0,
    completed: Array.isArray(filteredTasks) ? filteredTasks.filter(t => t.status === 'completed').length : 0,
    urgent: Array.isArray(filteredTasks) ? filteredTasks.filter(t => t.priority === 'urgent').length : 0,
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#64748b';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in-progress': return '#3b82f6';
      case 'pending': return '#64748b';
      default: return '#64748b';
    }
  };
  const generateChartData = () => {
    if (!Array.isArray(tasks) || tasks.length === 0) {

      const fallbackData = [];
      if (activeTab === 'Daily') {
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          fallbackData.push({
            name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
            value1: 0,
            value2: 0,
          });
        }
      } else if (activeTab === 'Weekly') {
        for (let i = 7; i >= 0; i--) {
          fallbackData.push({
            name: `W${8-i}`,
            value1: 0,
            value2: 0,
          });
        }
      } else {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        months.forEach(month => {
          fallbackData.push({
            name: month,
            value1: 0,
            value2: 0,
          });
        });
      }
      return fallbackData;
    }

    const now = new Date();
    let periods: { name: string; start: Date; end: Date }[] = [];

    try {
      if (activeTab === 'Daily') {

        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          periods.push({
            name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
            start: new Date(date.setHours(0, 0, 0, 0)),
            end: new Date(date.setHours(23, 59, 59, 999))
          });
        }
      } else if (activeTab === 'Weekly') {

        for (let i = 7; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          periods.push({
            name: `W${8-i}`,
            start: new Date(weekStart.setHours(0, 0, 0, 0)),
            end: new Date(weekEnd.setHours(23, 59, 59, 999))
          });
        }
      } else {

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          
          periods.push({
            name: date.toLocaleDateString('es-ES', { month: 'short' }),
            start: monthStart,
            end: new Date(monthEnd.setHours(23, 59, 59, 999))
          });
        }
      }

      return periods.map(period => {
        const completedInPeriod = tasks.filter(task => {
          if (task.status !== 'completed' || !task.updatedAt) return false;
          try {
            const taskDate = new Date(task.updatedAt);
            return taskDate >= period.start && taskDate <= period.end;
          } catch (e) {
            return false;
          }
        });

        const inProgressInPeriod = tasks.filter(task => {
          if (task.status !== 'in-progress' || !task.updatedAt) return false;
          try {
            const taskDate = new Date(task.updatedAt);
            return taskDate >= period.start && taskDate <= period.end;
          } catch (e) {
            return false;
          }
        });

        return {
          name: period.name || 'N/A',
          value1: completedInPeriod.length || 0,
          value2: inProgressInPeriod.length || 0,
        };
      });
    } catch (error) {
      console.error('Error generating chart data:', error);

      return [
        { name: 'N/A', value1: 0, value2: 0 },
      ];
    }
  };
  const chartData = generateChartData();
  const safeChartData = Array.isArray(chartData) && chartData.length > 0 
    ? chartData.filter(item => item && typeof item.name === 'string' && typeof item.value1 === 'number' && typeof item.value2 === 'number')
    : [{ name: 'Sin datos', value1: 0, value2: 0 }];
  console.log('Chart Data:', chartData);
  console.log('Safe Chart Data:', safeChartData);
  console.log('Tasks:', tasks);
  console.log('Active Tab:', activeTab);

  return (
    <ThemeProvider theme={octomTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 300 }}>
              TASK MANAGER DE RAYMUNDO
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                placeholder="Search anything..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    '& fieldset': { border: 'none' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: '#6366f1',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Tareas Completadas
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.completed.toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="svg"
                    width={60}
                    height={20}
                    sx={{ mr: 1 }}
                  >
                    <path
                      d="M0,15 Q15,5 30,10 T60,8"
                      stroke="#6366f1"
                      strokeWidth="2"
                      fill="none"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#10b981' }}>
                      10+ more
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      from last week
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    En Progreso
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.inProgress.toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="svg"
                    width={60}
                    height={20}
                    sx={{ mr: 1 }}
                  >
                    <path
                      d="M0,12 Q15,8 30,5 T60,10"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#10b981' }}>
                      10+ more
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      from last week
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Tareas Pendientes
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {stats.pending.toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="svg"
                    width={60}
                    height={20}
                    sx={{ mr: 1 }}
                  >
                    <path
                      d="M0,10 Q15,15 30,8 T60,12"
                      stroke="#ef4444"
                      strokeWidth="2"
                      fill="none"
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#10b981' }}>
                      08+ more
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      from last week
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Task Done
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      color: activeTab === tab ? '#6366f1' : '#64748b',
                      fontWeight: activeTab === tab ? 600 : 400,
                      textTransform: 'none',
                      borderBottom: activeTab === tab ? '2px solid #6366f1' : 'none',
                      borderRadius: 0,
                      pb: 1,
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Box>
            </Box>
            
            {/* Chart Summary */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: '#6366f1', 
                    borderRadius: '50%' 
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  Tareas Completadas
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: '#8b5cf6', 
                    borderRadius: '50%' 
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  Tareas en Progreso
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart data={safeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value2"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="En Progreso"
                  />
                  <Area
                    type="monotone"
                    dataKey="value1"
                    stackId="1"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.8}
                    name="Completadas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>

          {/* Task List */}
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Tareas ({Array.isArray(tasks) ? tasks.length : 0})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenTaskDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Nueva Tarea
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            ) : !Array.isArray(filteredTasks) || filteredTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4, color: '#64748b' }}>
                <Typography variant="body1">
                  {searchTerm ? 'No se encontraron tareas que coincidan con la búsqueda' : 'No hay tareas disponibles'}
                </Typography>
                <Typography variant="body2">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primera tarea usando el botón de arriba'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredTasks.map((task) => (
                  <Box 
                    key={task._id}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2, 
                      backgroundColor: '#f8fafc', 
                      borderRadius: 2,
                      border: `2px solid ${task.status === 'completed' ? '#22c55e' : 'transparent'}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <IconButton 
                      sx={{ 
                        color: getStatusColor(task.status), 
                        mr: 2,
                        '&:hover': {
                          backgroundColor: `${getStatusColor(task.status)}20`,
                        }
                      }}
                      onClick={() => {
                        const nextStatus = task.status === 'pending' ? 'in-progress' : 
                                         task.status === 'in-progress' ? 'completed' : 'pending';
                        handleStatusChange(task._id, nextStatus);
                      }}
                    >
                      <PlayIcon />
                    </IconButton>

                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          opacity: task.status === 'completed' ? 0.7 : 1,
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(task.status)}20`,
                            color: getStatusColor(task.status),
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            backgroundColor: `${getPriorityColor(task.priority)}20`,
                            color: getPriorityColor(task.priority),
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                        {task.dueDate && (
                          <>
                            <TimeIcon sx={{ fontSize: 14, color: '#64748b' }} />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Typography>
                          </>
                        )}
                        {task.category && (
                          <>
                            <CalendarIcon sx={{ fontSize: 14, color: '#64748b', ml: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {task.category}
                            </Typography>
                          </>
                        )}
                      </Box>
                      {task.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {task.description}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(task)}
                        sx={{
                          color: '#6366f1',
                          '&:hover': {
                            backgroundColor: '#6366f120',
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task._id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: '#ef444420',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Dialog para crear/editar tareas */}
      <Dialog 
        open={openTaskDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Título"
              value={newTask.title}
              onChange={(e) => {
                setNewTask(prev => ({ ...prev, title: e.target.value }));
                validateField('title', e.target.value);
              }}
              required
              autoFocus
              error={!!validationErrors.title}
              helperText={validationErrors.title || 'Ingresa un título descriptivo para la tarea'}
            />
            
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => {
                setNewTask(prev => ({ ...prev, description: e.target.value }));
                validateField('description', e.target.value);
              }}
              error={!!validationErrors.description}
              helperText={validationErrors.description || 'Describe los detalles de la tarea (opcional)'}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={newTask.status}
                  label="Estado"
                  onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="in-progress">En Progreso</MenuItem>
                  <MenuItem value="completed">Completada</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Prioridad"
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                >
                  <MenuItem value="low">Baja</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                  <MenuItem value="urgent">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Categoría"
                value={newTask.category}
                onChange={(e) => {
                  setNewTask(prev => ({ ...prev, category: e.target.value }));
                  validateField('category', e.target.value);
                }}
                error={!!validationErrors.category}
                helperText={validationErrors.category || 'Ej: Trabajo, Personal, Estudio (opcional)'}
              />
              
              <TextField
                fullWidth
                label="Fecha límite"
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => {
                  setNewTask(prev => ({ ...prev, dueDate: e.target.value }));
                  validateField('dueDate', e.target.value);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!validationErrors.dueDate}
                helperText={validationErrors.dueDate || 'Fecha y hora para completar la tarea (opcional)'}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            disabled={Object.keys(validationErrors).length > 0 || !newTask.title.trim()}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              '&:disabled': {
                background: '#e2e8f0',
                color: '#64748b',
              },
            }}
          >
            {editingTask ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;