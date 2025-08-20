@echo off

:: Setup
:: -----
setlocal enabledelayedexpansion

:: 1. Install npm packages
echo Installing npm packages...
call npm install --production

:: 2. Post deployment step
echo Deployment completed successfully!
