import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  Badge,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Assignment as ProjectIcon,
  Group as TeamIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  CheckCircle as CompleteIcon,
  Schedule as PendingIcon,
  PlayArrow as InProgressIcon
} from '@mui/icons-material';

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  budget: number;
  technology: string[];
}

function App() {
  // State Management
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Initialize demo data
  useEffect(() => {
    const demoProjects: Project[] = [
      {
        id: '1',
        name: 'ROMI AI - Sistema de Gestión',
        description: 'Plataforma integral de gestión empresarial con IA',
        status: 'in-progress',
        priority: 'high',
        progress: 75,
        startDate: '2025-01-15',
        endDate: '2025-03-30',
        team: ['Ana García', 'Carlos López', 'María Rodríguez'],
        budget: 150000,
        technology: ['React', 'Node.js', 'Azure', 'MongoDB']
      },
      {
        id: '2',
        name: 'Portal Cliente ROMI',
        description: 'Interface web para clientes con dashboard personalizado',
        status: 'planning',
        priority: 'medium',
        progress: 25,
        startDate: '2025-02-01',
        endDate: '2025-04-15',
        team: ['Luis Martín', 'Elena Vargas'],
        budget: 80000,
        technology: ['React', 'TypeScript', 'Material-UI']
      },
      {
        id: '3',
        name: 'API Gateway ROMI',
        description: 'Microservicios y API centralizada para todos los productos',
        status: 'completed',
        priority: 'critical',
        progress: 100,
        startDate: '2024-11-01',
        endDate: '2025-01-10',
        team: ['Roberto Kim', 'Sofia Chen', 'Diego Morales'],
        budget: 200000,
        technology: ['Node.js', 'Express', 'Azure Functions', 'Docker']
      }
    ];

    setProjects(demoProjects);
  }, []);

  // Helper Functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'planning': return 'warning';
      case 'on-hold': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CompleteIcon />;
      case 'in-progress': return <InProgressIcon />;
      case 'planning': return <PendingIcon />;
      default: return <PendingIcon />;
    }
  };

  // Dashboard Component
  const DashboardView = () => (
    <Grid container spacing={3}>
      {/* Metrics Cards */}
      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <ProjectIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="primary">
                  {projects.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proyectos Activos
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <CompleteIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="success.main">
                  {projects.filter(p => p.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completados
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TeamIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
              <Box>
                <Typography variant="h4" color="info.main">
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Miembros del Equipo
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Box>
                <Typography variant="h4" color="warning.main">
                  $430K
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Presupuesto Total
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Projects */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Proyectos Recientes</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
              >
                Nuevo Proyecto
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Proyecto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Progreso</TableCell>
                    <TableCell>Equipo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1">{project.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {project.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(project.status)}
                          label={project.status}
                          color={getStatusColor(project.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={project.priority}
                          color={getPriorityColor(project.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box width="100px">
                          <LinearProgress
                            variant="determinate"
                            value={project.progress}
                            color={project.progress === 100 ? 'success' : 'primary'}
                          />
                          <Typography variant="caption">{project.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar
                              key={index}
                              sx={{ width: 24, height: 24, ml: index > 0 ? -1 : 0 }}
                            >
                              {member.charAt(0)}
                            </Avatar>
                          ))}
                          {project.team.length > 3 && (
                            <Avatar sx={{ width: 24, height: 24, ml: -1 }}>
                              +{project.team.length - 3}
                            </Avatar>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Navigation Drawer
  const NavigationDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{ '& .MuiDrawer-paper': { width: 280 } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary">
          🚀 ROMI AI Platform
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => { setCurrentView('dashboard'); setDrawerOpen(false); }}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => { setCurrentView('projects'); setDrawerOpen(false); }}>
          <ListItemIcon>
            <ProjectIcon />
          </ListItemIcon>
          <ListItemText primary="Proyectos" />
        </ListItem>
        <ListItem button onClick={() => { setCurrentView('team'); setDrawerOpen(false); }}>
          <ListItemIcon>
            <TeamIcon />
          </ListItemIcon>
          <ListItemText primary="Equipo" />
        </ListItem>
        <ListItem button onClick={() => { setCurrentView('settings'); setDrawerOpen(false); }}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItem>
      </List>
    </Drawer>
  );

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
            🏢 ROMI AI - Gestión de Proyectos
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
            label="v2.0" 
            color="secondary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <NavigationDrawer />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4, flexGrow: 1 }}>
        {/* Welcome Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>¡Bienvenido a ROMI AI Platform!</strong> Plataforma completa de gestión de proyectos con infraestructura Azure robusta.
        </Alert>

        {/* Content based on current view */}
        {currentView === 'dashboard' && <DashboardView />}
        
        {currentView === 'projects' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Gestión de Proyectos</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Vista completa de todos los proyectos en desarrollo
              </Typography>
            </CardContent>
          </Card>
        )}

        {currentView === 'team' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Gestión de Equipo</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Administración de miembros del equipo y roles
              </Typography>
            </CardContent>
          </Card>
        )}

        {currentView === 'settings' && (
          <Card>
            <CardContent>
              <Typography variant="h5">Configuración del Sistema</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Configuración de seguridad, accesos y preferencias
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
                © 2025 ROMI AI - Plataforma de Gestión Empresarial
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} gap={1}>
                <Chip label="Azure Web App" color="info" size="small" />
                <Chip label="CI/CD Active" color="success" size="small" />
                <Chip label="Terraform IaC" color="primary" size="small" />
                <Chip label="Security Enabled" color="warning" size="small" />
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
    </Box>
  );
}

export default App;
