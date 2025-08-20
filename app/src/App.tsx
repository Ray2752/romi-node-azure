import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Fab,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  ErrorOutline as ErrorOutlineIcon,
  NotificationsNone as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ApiTestPanel from './components/ApiTestPanel';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Interfaces TypeScript
interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
  highPriority: number;
}

interface NewTask {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: string;
  tags?: string[];
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    completionRate: 0,
    highPriority: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState(0);
  
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: '',
    dueDate: '',
    tags: []
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadTasks();
    loadStats();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Error al cargar tareas');
      const result = await response.json();
      
      // El backend devuelve { success: true, data: tasks, pagination: {...} }
      if (result.success && Array.isArray(result.data)) {
        setTasks(result.data);
      } else if (Array.isArray(result)) {
        // Fallback por si el backend devuelve directamente el array
        setTasks(result);
      } else {
        console.error('API response format is not expected:', result);
        setTasks([]);
        setError('Error: La respuesta de la API no es válida');
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
      setTasks([]); // Asegurar que tasks siempre sea un array
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/tasks/stats/summary');
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const result = await response.json();
      
      // El backend devuelve { success: true, data: {...} }
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        console.error('Stats API response format is not expected:', result);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleCreateTask = async () => {
    try {
      console.log('=== DEBUG: Creando tarea desde Dashboard ===');
      console.log('Estado newTask original:', newTask);
      
      // Limpiar y validar los datos antes de enviar
      const taskToSend = {
        title: newTask.title?.trim(),
        description: newTask.description?.trim(),
        status: newTask.status || 'pending',
        priority: newTask.priority || 'medium',
        category: newTask.category?.trim() || 'general',
        ...(newTask.dueDate && { dueDate: newTask.dueDate }),
        ...(newTask.tags && newTask.tags.length > 0 && { tags: newTask.tags })
      };
      
      console.log('Datos preparados para envío:', taskToSend);
      console.log('JSON que se enviará:', JSON.stringify(taskToSend, null, 2));
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToSend),
      });
      
      const result = await response.json();
      console.log('Status de respuesta:', response.status);
      console.log('Respuesta completa del servidor:', result);
      
      if (!response.ok) {
        // Mostrar errores específicos de validación si están disponibles
        if (result.errors && Array.isArray(result.errors)) {
          throw new Error(`Errores de validación: ${result.errors.join(', ')}`);
        } else {
          throw new Error(result.message || 'Error al crear tarea');
        }
      }
      
      console.log('✅ Tarea creada exitosamente:', result.data);
      
      setOpenDialog(false);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        category: '',
        dueDate: '',
        tags: []
      });
      
      loadTasks();
      loadStats();
    } catch (err) {
      console.error('❌ Error creando tarea:', err);
      setError(err instanceof Error ? err.message : 'Error al crear tarea');
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Error al actualizar estado');
      
      loadTasks();
      loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar tarea');
      
      loadTasks();
      loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar tarea');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'in-progress': return <PlayArrowIcon />;
      case 'pending': return <AssignmentIcon />;
      default: return <AssignmentIcon />;
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Cargando Task Manager...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <AssignmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Badge badgeContent={4} color="secondary">
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Badge>
          <IconButton
            color="inherit"
            onClick={(e: any) => setAnchorEl(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              R
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem>Perfil</MenuItem>
            <MenuItem>Configuración</MenuItem>
            <MenuItem>Cerrar Sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Tabs 
            value={currentTab} 
            onChange={(event, newValue) => setCurrentTab(newValue)}
            aria-label="navigation tabs"
          >
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab 
              icon={<CodeIcon />} 
              label="API Testing" 
              id="tab-1"
              aria-controls="tabpanel-1"
            />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Tab Panel 0 - Dashboard */}
        <Box
          role="tabpanel"
          hidden={currentTab !== 0}
          id="tabpanel-0"
          aria-labelledby="tab-0"
        >
          {currentTab === 0 && (
            <>
        {/* Mensaje de bienvenida */}
        <Alert severity="info" sx={{ mb: 3 }}>
          ¡Bienvenido a Task Manager! Organiza y gestiona tus tareas de manera eficiente.
        </Alert>

        {/* Botón de Prueba Rápida */}
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={async () => {
              try {
                const testTask = {
                  title: `Prueba Directa ${new Date().toLocaleTimeString()}`,
                  description: 'Tarea creada directamente sin formulario',
                  status: 'pending',
                  priority: 'medium',
                  category: 'debug'
                };
                
                console.log('🧪 Prueba directa - enviando:', testTask);
                
                const response = await fetch('/api/tasks', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(testTask),
                });
                
                const result = await response.json();
                console.log('🧪 Resultado de prueba directa:', result);
                
                if (response.ok) {
                  loadTasks();
                  loadStats();
                  alert('✅ Tarea de prueba creada exitosamente!');
                } else {
                  alert(`❌ Error: ${result.message}`);
                }
              } catch (error) {
                console.error('🧪 Error en prueba directa:', error);
                alert(`❌ Error: ${error}`);
              }
            }}
          >
            🧪 Crear Tarea de Prueba Directa
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Cargando tareas...
          </Alert>
        )}

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AssignmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.total}</Typography>
                    <Typography color="text.secondary">Total de Tareas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.completed}</Typography>
                    <Typography color="text.secondary">Completadas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <PlayArrowIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.inProgress}</Typography>
                    <Typography color="text.secondary">En Progreso</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <ErrorOutlineIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.overdue}</Typography>
                    <Typography color="text.secondary">Vencidas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de Tareas */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Tareas</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Nueva Tarea
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
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
                  {Array.isArray(tasks) && tasks.length > 0 ? tasks.map((task: any) => (
                    <TableRow key={task._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{task.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={task.status === 'in-progress' ? 'En Progreso' : 
                                task.status === 'completed' ? 'Completada' : 'Pendiente'}
                          color={getStatusColor(task.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.priority === 'high' ? 'Alta' : 
                                task.priority === 'urgent' ? 'Urgente' :
                                task.priority === 'medium' ? 'Media' : 'Baja'}
                          color={getPriorityColor(task.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <Box display="flex" alignItems="center">
                            <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin fecha
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
                          {task.category || 'Sin categoría'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                          {task.tags?.map((tag: any, index: any) => (
                            <Chip key={index} label={tag} size="small" variant="outlined" />
                          )) || <Typography variant="body2" color="text.secondary">Sin etiquetas</Typography>}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Editar">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setEditingTask(task);
                                setNewTask({
                                  title: task.title,
                                  description: task.description,
                                  status: task.status,
                                  priority: task.priority,
                                  category: task.category,
                                  dueDate: task.dueDate || '',
                                  tags: task.tags || []
                                });
                                setOpenDialog(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Marcar como completada">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleUpdateStatus(task._id, 'completed')}
                              disabled={task.status === 'completed'}
                            >
                              <DoneIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                          {loading ? 'Cargando tareas...' : 'No hay tareas disponibles. ¡Crea tu primera tarea!'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* FAB para nueva tarea */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>

        {/* Dialog para Nueva/Editar Tarea */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={newTask.title}
                    onChange={(e: any) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    value={newTask.description}
                    onChange={(e: any) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={newTask.status}
                      label="Estado"
                      onChange={(e: SelectChangeEvent) => setNewTask({ ...newTask, status: e.target.value as any })}
                    >
                      <MenuItem value="pending">Pendiente</MenuItem>
                      <MenuItem value="in-progress">En Progreso</MenuItem>
                      <MenuItem value="completed">Completada</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Prioridad</InputLabel>
                    <Select
                      value={newTask.priority}
                      label="Prioridad"
                      onChange={(e: SelectChangeEvent) => setNewTask({ ...newTask, priority: e.target.value as any })}
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
                    value={newTask.category}
                    onChange={(e: any) => setNewTask({ ...newTask, category: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Fecha de vencimiento"
                    InputLabelProps={{ shrink: true }}
                    value={newTask.dueDate}
                    onChange={(e: any) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenDialog(false);
              setEditingTask(null);
              setNewTask({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                category: '',
                dueDate: '',
                tags: []
              });
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                setNewTask({
                  title: 'Tarea de prueba Dashboard',
                  description: 'Prueba directa desde el formulario',
                  status: 'pending',
                  priority: 'medium',
                  category: 'test',
                  dueDate: '',
                  tags: []
                });
              }}
              variant="outlined"
              color="secondary"
            >
              Datos de Prueba
            </Button>
            <Button onClick={handleCreateTask} variant="contained">
              {editingTask ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>
            </>
          )}
        </Box>

        {/* Tab Panel 1 - API Testing */}
        <Box
          role="tabpanel"
          hidden={currentTab !== 1}
          id="tabpanel-1"
          aria-labelledby="tab-1"
        >
          {currentTab === 1 && (
            <ApiTestPanel />
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 8, py: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Task Manager - Gestión Personal de Tareas
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={1}>
            <Chip label="React App" color="primary" size="small" />
            <Chip label="Material-UI" color="secondary" size="small" />
            <Chip label="TypeScript" color="info" size="small" />
            <Chip label="Responsive" color="success" size="small" />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
