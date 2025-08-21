// Script para probar la funcionalidad completa de la API
const API_BASE_URL = 'http://localhost:3001/api';

// Función para hacer peticiones HTTP
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Probar todas las funcionalidades
async function testAPI() {
  console.log('🧪 Iniciando pruebas de API...\n');

  // 1. Obtener todas las tareas
  console.log('1️⃣ Obteniendo todas las tareas...');
  const getTasks = await makeRequest(`${API_BASE_URL}/tasks`);
  console.log('Resultado:', getTasks);
  console.log(`Total de tareas: ${getTasks.data?.data?.length || 0}\n`);

  // 2. Crear una nueva tarea
  console.log('2️⃣ Creando una nueva tarea...');
  const newTask = {
    title: 'Tarea de Prueba API',
    description: 'Esta es una tarea creada para probar la API',
    status: 'pending',
    priority: 'medium',
    category: 'testing'
  };

  const createTask = await makeRequest(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  });
  console.log('Resultado:', createTask);
  
  if (createTask.success) {
    const taskId = createTask.data?.data?._id || createTask.data?._id;
    console.log(`✅ Tarea creada con ID: ${taskId}\n`);

    // 3. Actualizar la tarea
    console.log('3️⃣ Actualizando la tarea...');
    const updateTask = await makeRequest(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in-progress', priority: 'high' })
    });
    console.log('Resultado:', updateTask);
    console.log('✅ Tarea actualizada\n');

    // 4. Obtener tareas actualizadas
    console.log('4️⃣ Verificando cambios...');
    const getUpdatedTasks = await makeRequest(`${API_BASE_URL}/tasks`);
    console.log(`Total de tareas después de crear: ${getUpdatedTasks.data?.data?.length || 0}\n`);

    // 5. Eliminar la tarea de prueba
    console.log('5️⃣ Eliminando la tarea de prueba...');
    const deleteTask = await makeRequest(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    console.log('Resultado:', deleteTask);
    console.log('✅ Tarea eliminada\n');
  }

  console.log('🎉 Pruebas completadas!');
}

// Ejecutar las pruebas
testAPI().catch(console.error);
