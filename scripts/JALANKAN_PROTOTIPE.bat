@echo off
REM Launcher untuk prototipe Jubir Warga
REM Dobel-klik file ini → otomatis start server + buka browser

cd /d "%~dp0"

REM Cek Python ada
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ====================================
    echo Python belum terinstall.
    echo Install dari: https://python.org/downloads
    echo Atau pakai: winget install Python.Python.3.12
    echo.
    echo Atau pakai cara alternatif:
    echo   1. Dobel-klik "Jubir Warga - Standalone.html"
    echo   2. Atau drag file ke window Chrome
    echo ====================================
    echo.
    pause
    exit /b
)

echo ===========================================
echo  Jubir Warga Prototipe — Local Server
echo ===========================================
echo.
echo Server akan jalan di: http://localhost:8765
echo.
echo Pilih file untuk dibuka:
echo   1. Standalone (single-file, paling stabil)
echo   2. Multi-file ^(versi dev — perlu untuk edit^)
echo.
set /p choice="Pilih (1 atau 2, default 1): "

if "%choice%"=="2" (
    set TARGET=index.html
) else (
    set TARGET=Jubir Warga - Standalone.html
)

echo.
echo Buka browser ke: http://localhost:8765/%TARGET%
echo.
echo TIPS:
echo   - Tekan Ctrl+C di window ini untuk stop server
echo   - Refresh browser dengan Ctrl+Shift+R kalau ada cache issue
echo.
echo Starting server...

REM Open browser
start "" "http://localhost:8765/%TARGET%"

REM Start Python server (foreground, biar Ctrl+C stop server)
python -m http.server 8765
