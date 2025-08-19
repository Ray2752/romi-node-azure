# 🧪 ROMI Task Manager API - PowerShell Test Script
# Ejecutar en PowerShell para probar la API

$BaseURL = "https://romi-node-webapp-12345.azurewebsites.net"

Write-Host "🚀 Testing ROMI Task Manager API..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

Write-Host "`n1. 📋 API Info:" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BaseURL/" -Method GET
$response | ConvertTo-Json -Depth 3

Write-Host "`n2. ❤️ Health Check:" -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$BaseURL/api/health" -Method GET
$health | ConvertTo-Json

Write-Host "`n3. 📝 Get All Tasks:" -ForegroundColor Yellow
$tasks = Invoke-RestMethod -Uri "$BaseURL/api/tasks" -Method GET
$tasks | ConvertTo-Json -Depth 3

Write-Host "`n4. ➕ Create New Task:" -ForegroundColor Yellow
$newTask = @{
    title = "Probar API desde PowerShell"
    description = "Verificar integración con Windows"
    status = "pending"
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "$BaseURL/api/tasks" -Method POST -Body $newTask -ContentType "application/json"
$created | ConvertTo-Json

Write-Host "`n5. 🔍 Get Task by ID:" -ForegroundColor Yellow
$task1 = Invoke-RestMethod -Uri "$BaseURL/api/tasks/1" -Method GET
$task1 | ConvertTo-Json

Write-Host "`n6. 📝 Filter Completed Tasks:" -ForegroundColor Yellow
$completedTasks = Invoke-RestMethod -Uri "$BaseURL/api/tasks?status=completed" -Method GET
$completedTasks | ConvertTo-Json -Depth 3

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Green
Write-Host "🌐 Visit: $BaseURL" -ForegroundColor Cyan
