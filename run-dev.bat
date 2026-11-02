@echo off
title Hindustan Computer - Store & Admin Portal
echo ===================================================
echo     HINDUSTAN COMPUTER - E-COMMERCE & ADMIN
echo ===================================================
echo.
set "PATH=%USERPROFILE%\tools\nodejs;%PATH%"
echo Starting Local Storefront and Admin Server...
echo Store Website:    http://localhost:3000
echo Shopkeeper Admin: http://localhost:3000/admin
echo.
npm run dev
pause
