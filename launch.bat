@echo off
echo ========================================
echo    SMRU HOSTEL CARE - QUICK LAUNCHER
echo ========================================
echo.
echo Starting your hostel management system...
echo.

REM Try to start a local server
if exist "index.html" (
    echo Opening SMRU Hostel Care in your default browser...
    start "" "index.html"
    echo.
    echo ✅ System launched successfully!
    echo.
    echo 🎯 Quick Test:
    echo 1. Register as student
    echo 2. Submit a complaint  
    echo 3. Login as staff: maintenance@smru.edu / staff123
    echo 4. Update complaint status
    echo.
    echo 📖 Full documentation in QUICK_START.md
    echo.
) else (
    echo ❌ Error: index.html not found
    echo Please run this from your project directory
)

pause