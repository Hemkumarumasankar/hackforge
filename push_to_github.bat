@echo off
echo ===========================================
echo 🚀 Integrating with GitHub...
echo ===========================================

REM 1. Initialize Git (Safe to run multiple times)
"C:\Program Files\Git\cmd\git.exe" init

REM 2. Add all files (respecting the new .gitignore)
echo.
echo 📦 Adding files...
"C:\Program Files\Git\cmd\git.exe" add .

REM 3. Commit
echo.
echo 📝 Committing changes...
"C:\Program Files\Git\cmd\git.exe" commit -m "feat: Complete Nexus Portal with Large File Upload support"

REM 4. Setup Branch and Remote
echo.
echo 🔗 Linking to repository...
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/Hemkumarumasankar/HackForge-submission-portal.git

REM 5. Push
echo.
echo ☁️ Pushing to GitHub...
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo ===========================================
echo ✅ Done! Your code is now on GitHub.
echo You can now proceed with Vercel/Railway deployment.
echo ===========================================
pause
