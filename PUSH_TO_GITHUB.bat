@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo ============================================================
echo   PUSH JUBIR WARGA KE GITHUB
echo   Repo: msyafiqwahyudi26/Jubir-Warga
echo ============================================================
echo.

REM ---- 1. Cek Git ----
where git >nul 2>nul
if errorlevel 1 (
  echo [X] Git belum terinstall.
  echo     Download: https://git-scm.com/download/win
  echo.
  pause
  exit /b 1
)
echo [OK] Git terinstall.
git --version
echo.

REM ---- 2. Init repo kalau belum ada ----
if not exist ".git" (
  echo [..] git init
  git init
  git branch -M main
) else (
  echo [OK] Repo Git sudah ada.
  git branch -M main 2>nul
)
echo.

REM ---- 3. Set user (skip kalau udah ada) ----
for /f "tokens=*" %%i in ('git config user.name 2^>nul') do set GITUSER=%%i
if "!GITUSER!"=="" (
  set /p GITUSER=Nama Git (cth: Syafiq Wahyudi):
  git config user.name "!GITUSER!"
)
for /f "tokens=*" %%i in ('git config user.email 2^>nul') do set GITEMAIL=%%i
if "!GITEMAIL!"=="" (
  set /p GITEMAIL=Email Git (cth: msyafiqwahyudi26@gmail.com):
  git config user.email "!GITEMAIL!"
)
echo [OK] User: !GITUSER! ^<!GITEMAIL!^>
echo.

REM ---- 4. Pasang remote (replace kalau udah ada) ----
git remote remove origin >nul 2>nul
git remote add origin https://github.com/msyafiqwahyudi26/Jubir-Warga.git
echo [OK] Remote di-set ke msyafiqwahyudi26/Jubir-Warga
echo.

REM ---- 5. Stage + commit ----
echo [..] git add .
git add .
echo.
echo [..] git commit
git commit -m "Foundation refactor: folder structure + 6 detail pages + PWA setup" 2>&1
if errorlevel 1 (
  echo [i] Tidak ada perubahan baru utk di-commit ^(atau sudah pernah di-commit^). Lanjut push.
)
echo.

REM ---- 6. Push ----
echo ============================================================
echo   PUSH KE GITHUB
echo ============================================================
echo.
echo Kalau muncul popup "Sign in to GitHub" di browser:
echo    1. Login pakai akun msyafiqwahyudi26
echo    2. Klik Authorize
echo.
echo Kalau diminta password di terminal ini:
echo    Password GitHub biasa SUDAH TIDAK BISA dipakai.
echo    Generate Personal Access Token (PAT) dulu di:
echo    https://github.com/settings/tokens (scope: repo)
echo    Lalu paste token sebagai password.
echo.

git push -u origin main 2>&1
set PUSH_RESULT=%errorlevel%
echo.

if %PUSH_RESULT% EQU 0 (
  echo ============================================================
  echo   [SUCCESS] Push berhasil!
  echo   Cek: https://github.com/msyafiqwahyudi26/Jubir-Warga
  echo ============================================================
) else (
  echo ============================================================
  echo   [FAIL] Push GAGAL ^(error code %PUSH_RESULT%^)
  echo.
  echo   Solusi paling sering:
  echo   - Auth gagal: pakai PAT, BUKAN password biasa
  echo     Buat PAT: https://github.com/settings/tokens
  echo   - Conflict: jalankan 'git pull origin main --rebase' dulu
  echo   - Branch salah: cek 'git branch' apakah di 'main'
  echo.
  echo   Screenshot pesan error di atas dan kirim ke Claude.
  echo ============================================================
)
echo.
echo Tekan tombol apa saja untuk menutup window ini...
pause >nul
