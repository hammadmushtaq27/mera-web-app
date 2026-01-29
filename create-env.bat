@echo off
echo Creating .env file for Azure Web Application...
echo.

cd /d "C:\Users\Hammad Mushtaq\Documents\mera-web-app"

echo # Azure Web App Configuration > .env
echo PORT=3000 >> .env
echo NODE_ENV=production >> .env
echo WEBSITE_NODE_DEFAULT_VERSION=~20 >> .env
echo SESSION_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM% >> .env
echo JWT_SECRET=%RANDOM%%RANDOM%%RANDOM%%RANDOM%%RANDOM% >> .env
echo APP_NAME="My Azure Web App" >> .env
echo APP_VERSION="2.0.0" >> .env

echo .env file created successfully!
echo.
echo Contents:
type .env
echo.
pause