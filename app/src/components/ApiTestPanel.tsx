import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface ApiResponse {
  status: number;
  data: any;
  error?: string;
  timestamp: string;
}

interface ApiTest {
  name: string;
  method: string;
  endpoint: string;
  description: string;
  bodyTemplate?: any;
  requiresId?: boolean;
}

const apiTests: ApiTest[] = [
  {
    name: 'Health Check',
    method: 'GET',
    endpoint: '/api/health',
    description: 'Verificar que el servidor esté funcionando'
  },
  {
    name: 'Obtener todas las tareas',
    method: 'GET',
    endpoint: '/api/tasks',
    description: 'Obtener lista de todas las tareas'
  },
  {
    name: 'Obtener estadísticas',
    method: 'GET',
    endpoint: '/api/tasks/stats/summary',
    description: 'Obtener estadísticas resumidas de las tareas'
  },
  {
    name: 'Crear nueva tarea',
    method: 'POST',
    endpoint: '/api/tasks',
    description: 'Crear una nueva tarea',
    bodyTemplate: {
      title: 'Tarea de prueba',
      description: 'Esta es una tarea creada desde el panel de pruebas',
      status: 'pending',
      priority: 'medium',
      category: 'desarrollo',
      tags: ['test', 'api']
    }
  },
  {
    name: 'Obtener tarea por ID',
    method: 'GET',
    endpoint: '/api/tasks/:id',
    description: 'Obtener una tarea específica por su ID',
    requiresId: true
  },
  {
    name: 'Actualizar estado de tarea',
    method: 'PATCH',
    endpoint: '/api/tasks/:id/status',
    description: 'Actualizar el estado de una tarea',
    requiresId: true,
    bodyTemplate: {
      status: 'completed'
    }
  },
  {
    name: 'Actualizar tarea completa',
    method: 'PUT',
    endpoint: '/api/tasks/:id',
    description: 'Actualizar todos los campos de una tarea',
    requiresId: true,
    bodyTemplate: {
      title: 'Tarea actualizada',
      description: 'Descripción actualizada desde el panel de pruebas',
      status: 'in-progress',
      priority: 'high',
      category: 'testing'
    }
  },
  {
    name: 'Eliminar tarea',
    method: 'DELETE',
    endpoint: '/api/tasks/:id',
    description: 'Eliminar una tarea específica',
    requiresId: true
  }
];

const ApiTestPanel: React.FC = () => {
  const [responses, setResponses] = useState<{ [key: string]: ApiResponse }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [taskId, setTaskId] = useState('');
  const [customBody, setCustomBody] = useState<{ [key: string]: string }>({});

  const executeApiCall = async (test: ApiTest) => {
    const testKey = `${test.method}-${test.endpoint}`;
    setLoading((prev: Record<string, boolean>) => ({ ...prev, [testKey]: true }));

    try {
      let url = test.endpoint;
      
      // Reemplazar :id si es necesario
      if (test.requiresId && taskId) {
        url = url.replace(':id', taskId);
      } else if (test.requiresId && !taskId) {
        throw new Error('Se requiere un ID de tarea para este endpoint');
      }

      const options: RequestInit = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Añadir body si es necesario
      if (test.bodyTemplate && (test.method === 'POST' || test.method === 'PUT' || test.method === 'PATCH')) {
        const bodyToSend = customBody[testKey] 
          ? JSON.parse(customBody[testKey]) 
          : test.bodyTemplate;
        options.body = JSON.stringify(bodyToSend);
      }

      const response = await fetch(url, options);
      const data = await response.json();

      const apiResponse: ApiResponse = {
        status: response.status,
        data: data,
        timestamp: new Date().toISOString()
      };

      setResponses((prev: Record<string, ApiResponse>) => ({ ...prev, [testKey]: apiResponse }));

    } catch (error) {
      const apiResponse: ApiResponse = {
        status: 0,
        data: null,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      };

      setResponses((prev: Record<string, ApiResponse>) => ({ ...prev, [testKey]: apiResponse }));
    } finally {
      setLoading((prev: Record<string, boolean>) => ({ ...prev, [testKey]: false }));
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'default';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PUT': return 'warning';
      case 'PATCH': return 'secondary';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <CodeIcon color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" component="h2">
            Panel de Pruebas de API
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Usa este panel para probar directamente todos los endpoints de la API desde el frontend.
        </Alert>

        {/* Campo para ID de tarea */}
        <Box mb={3}>
          <TextField
            fullWidth
            label="ID de Tarea (para endpoints que lo requieren)"
            value={taskId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskId(e.target.value)}
            placeholder="Ej: 507f1f77bcf86cd799439011"
            helperText="Copia un ID de tarea de las respuestas de GET /api/tasks"
          />
        </Box>

        <Grid container spacing={2}>
          {apiTests.map((test) => {
            const testKey = `${test.method}-${test.endpoint}`;
            const response = responses[testKey];
            const isLoading = loading[testKey];

            return (
              <Grid item xs={12} key={testKey}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Chip 
                        label={test.method} 
                        color={getMethodColor(test.method) as any}
                        size="small"
                      />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {test.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {test.endpoint}
                      </Typography>
                      {response && (
                        <Chip
                          icon={response.status >= 200 && response.status < 300 ? 
                            <CheckCircleIcon /> : <ErrorIcon />}
                          label={response.status || 'Error'}
                          color={getStatusColor(response.status) as any}
                          size="small"
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <Typography variant="body2" color="text.secondary">
                        {test.description}
                      </Typography>

                      {/* Body editor para POST/PUT/PATCH */}
                      {test.bodyTemplate && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Body de la petición (JSON):
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={6}
                            value={customBody[testKey] || JSON.stringify(test.bodyTemplate, null, 2)}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomBody(prev => ({ 
                              ...prev, 
                              [testKey]: e.target.value 
                            }))}
                            variant="outlined"
                            sx={{ fontFamily: 'monospace' }}
                          />
                        </Box>
                      )}

                      <Box>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => executeApiCall(test)}
                          disabled={isLoading || (test.requiresId && !taskId)}
                          color={getMethodColor(test.method) as any}
                        >
                          {isLoading ? 'Ejecutando...' : `Ejecutar ${test.method}`}
                        </Button>
                      </Box>

                      {/* Respuesta */}
                      {response && (
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Respuesta:
                          </Typography>
                          <Box display="flex" gap={1} mb={2}>
                            <Chip 
                              label={`Status: ${response.status}`}
                              color={getStatusColor(response.status) as any}
                              size="small"
                            />
                            <Chip 
                              label={response.timestamp}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                          <Box 
                            component="pre" 
                            sx={{ 
                              bgcolor: 'grey.100', 
                              p: 2, 
                              borderRadius: 1, 
                              overflow: 'auto',
                              fontSize: '0.875rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            {response.error 
                              ? `Error: ${response.error}`
                              : JSON.stringify(response.data, null, 2)
                            }
                          </Box>
                        </Paper>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ApiTestPanel;
