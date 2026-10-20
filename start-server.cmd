@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo 南大人的美食地图正在启动。
echo 电脑访问：http://127.0.0.1:4173
echo 同一 Wi-Fi 下的手机请使用下面显示的局域网地址。
echo.
node static-server.mjs
