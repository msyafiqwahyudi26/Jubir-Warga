@echo off
REM Jalankan prototipe Jubir Warga di laptop kamu
REM Buka di browser: http://localhost:8765

cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo Python belum installed. Cara cepat:
    echo   winget install Python.Python.3.12
    echo Atau buka: https://python.org/downloads
    pause
    exit /b
)

echo ===========================================
echo  Jubir Warga — Local Server
echo  http://localhost:8765
echo ===========================================
echo.
echo Tekan Ctrl+C untuk stop server.
echo.

start "" "http://localhost:8765"
python -m http.server 8765
