# 🧪 ROMI Task Manager API - Test Scripts

## Prueba la API desplegada en Azure

BASE_URL="https://romi-node-webapp-12345.azurewebsites.net"

echo "🚀 Testing ROMI Task Manager API..."
echo "=================================="

echo -e "\n1. 📋 API Info:"
curl -s "$BASE_URL/" | jq

echo -e "\n2. ❤️ Health Check:"
curl -s "$BASE_URL/api/health" | jq

echo -e "\n3. 📝 Get All Tasks:"
curl -s "$BASE_URL/api/tasks" | jq

echo -e "\n4. ➕ Create New Task:"
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Probar API REST", "description": "Verificar que todos los endpoints funcionen", "status": "pending"}' | jq

echo -e "\n5. 🔍 Get Task by ID:"
curl -s "$BASE_URL/api/tasks/1" | jq

echo -e "\n6. 📝 Filter Tasks by Status:"
curl -s "$BASE_URL/api/tasks?status=completed" | jq

echo -e "\n7. ✏️ Update Task:"
curl -s -X PUT "$BASE_URL/api/tasks/2" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}' | jq

echo -e "\n8. 📝 Get All Tasks (Updated):"
curl -s "$BASE_URL/api/tasks" | jq

echo -e "\n✅ API Testing Complete!"
