# YieldVision Launcher for Windows PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  YieldVision: Machine Learning Crop Yield Prediction" -ForegroundColor Green
Write-Host "  Starting Backend (FastAPI) and Frontend (React/Vite)..." -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Launch Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Launch Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are launching in separate windows:" -ForegroundColor Green
Write-Host "  - Backend API:  http://127.0.0.1:8000 (Swagger docs at /docs)" -ForegroundColor White
Write-Host "  - Frontend App: http://127.0.0.1:5173" -ForegroundColor White
Write-Host ""
Write-Host "Opening web application in default browser..." -ForegroundColor Yellow
Start-Process "http://127.0.0.1:5173"
