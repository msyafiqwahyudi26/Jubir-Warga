@echo off
REM Push prototipe ke GitHub repo msyafiqwahyudi26/Jubir-Warga
REM Dobel-klik file ini untuk push code

cd /d "%~dp0"

echo ===========================================
echo  Push Jubir Warga Prototipe ke GitHub
echo ===========================================
echo.

REM Cek git installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git belum terinstall
    echo Install dari: https://git-scm.com/download/win
    pause
    exit /b
)

REM Init git repo kalau belum
if not exist .git (
    echo [1/5] Initialize git repo...
    git init
    git branch -M main
)

REM Set remote
echo [2/5] Setup remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/msyafiqwahyudi26/Jubir-Warga.git

REM Add files
echo [3/5] Stage files...
git add .

REM Commit
echo [4/5] Commit...
git commit -m "Deploy prototipe Jubir Warga 2.0 — Beranda + Tagih Janji + Nala AI + Paspor + Komunitas"

REM Push
echo [5/5] Push ke GitHub...
echo (Akan minta login GitHub kalau belum auth)
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push gagal. Kemungkinan masalah:
    echo - Belum login ke GitHub di laptop ini
    echo - Repo punya commit lain (perlu pull first: git pull --rebase origin main)
    echo - Branch beda (coba: git push -u origin master)
    echo.
    pause
    exit /b
)

echo.
echo ===========================================
echo  ✓ PUSH SUKSES
echo ===========================================
echo.
echo Repo: https://github.com/msyafiqwahyudi26/Jubir-Warga
echo.
echo Sekarang ke chat lagi — saya akan clone ke VPS.
echo.
pause
