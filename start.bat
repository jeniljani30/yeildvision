@echo off
echo ========================================================
echo   YieldVision: Machine Learning Crop Yield Prediction
echo   Starting Backend (FastAPI) and Frontend (React/Vite)...
echo ========================================================

cd /d "%~dp0"
start "YieldVision Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "YieldVision Frontend (React/Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching in separate windows:
echo - Backend API:  http://127.0.0.1:8000  (API Docs at /docs)
echo - Frontend App: http://127.0.0.1:5173
echo Opening web application in default browser...
start http://127.0.0.1:5173

echo.
echo Press any key to exit this launcher window...
pause >nul
