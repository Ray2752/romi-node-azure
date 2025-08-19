import React from 'react';
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
  Chip
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tema personalizado ROMI AI
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🚀 ROMI AI - Frontend Demo
          </Typography>
          <Chip 
            label="v1.0" 
            color="secondary" 
            size="small" 
            sx={{ ml: 2 }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Header Card */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                  🏢 ROMI AI - Challenge Técnico
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aplicación web desplegada en Azure con React + TypeScript
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label="React 18" color="primary" sx={{ mr: 1 }} />
                  <Chip label="TypeScript" color="primary" sx={{ mr: 1 }} />
                  <Chip label="Material-UI" color="primary" sx={{ mr: 1 }} />
                  <Chip label="Azure Static Web Apps" color="secondary" sx={{ mr: 1 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Features Cards */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🌐 Frontend Moderno
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aplicación React con TypeScript y Material-UI para una experiencia de usuario profesional.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ☁️ Despliegue Azure
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Infraestructura como código con Terraform y despliegue automatizado en Azure Static Web Apps.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🔧 CI/CD Pipeline
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  GitHub Actions para integración y despliegue continuo automatizado.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Company Info */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white' }}>
                  🤖 ROMI AI
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                  Soluciones de Inteligencia Artificial para el futuro
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  href="https://romiai.com.mx"
                  target="_blank"
                >
                  Visitar romiai.com.mx
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Info */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Estado del Sistema
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  <Chip 
                    label="✅ Frontend: Activo" 
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    label="🌐 Azure: Desplegado" 
                    color="info" 
                    variant="outlined"
                  />
                  <Chip 
                    label="🚀 Build: Exitoso" 
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    label="📱 Responsive: Activo" 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Aplicación lista para demostración técnica. Desarrollada como parte del challenge técnico para ROMI AI.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: theme.palette.grey[100] 
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 ROMI AI - Challenge Técnico Frontend
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Desarrollado con ❤️ para la evaluación técnica
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
