@echo off
chcp 65001 >nul 2>&1
title MalangaCraft Installer

SET SERVER_IP=malangacraft.dot0x.com
SET INSTANCE_NAME=MalangaCraft
SET MC_VERSION=1.21.1
SET FABRIC_LOADER=net.fabricmc.fabric-loader
SET FABRIC_VERSION=0.16.9

SET VOICECHAT_JAR=voicechat-fabric-1.21.1-2.6.12.jar
SET VOICECHAT_URL=https://edge.forgecdn.net/files/7614/32/%VOICECHAT_JAR%

REM ── Detectar Prism Launcher data ──
SET PRISM_DATA=%APPDATA%\PrismLauncher
IF NOT EXIST "%PRISM_DATA%" (
    echo ERROR: No se encontro PrismLauncher en %%APPDATA%%\PrismLauncher
    echo Instala Prism Launcher desde https://prismlauncher.org
    pause
    exit /b 1
)

SET INSTANCES=%PRISM_DATA%\instances
SET INST=%INSTANCES%\%INSTANCE_NAME%
SET MC_DIR=%INST%\.minecraft
SET MODS_DIR=%MC_DIR%\mods

echo.
echo === MalangaCraft Installer ===
echo Creando instancia %INSTANCE_NAME% en Prism Launcher...

mkdir "%INST%" 2>nul
mkdir "%MC_DIR%" 2>nul
mkdir "%MODS_DIR%" 2>nul

REM ── instance.cfg (INI format for Prism) ──
(
echo InstanceType=OneSix
echo name=%INSTANCE_NAME%
echo iconKey=default
) > "%INST%\instance.cfg"

REM ── mmc-pack.json (MC version + Fabric loader) ──
(
echo {
echo   "formatVersion": 1,
echo   "components": [
echo     { "uid": "net.minecraft", "version": "%MC_VERSION%", "important": true },
echo     { "uid": "%FABRIC_LOADER%", "version": "%FABRIC_VERSION%" }
echo   ]
echo }
) > "%INST%\mmc-pack.json"

REM ── Descargar Simple Voice Chat si no existe ──
IF NOT EXIST "%MODS_DIR%\%VOICECHAT_JAR%" (
    echo Descargando Simple Voice Chat mod...
    powershell -Command "Invoke-WebRequest -Uri '%VOICECHAT_URL%' -OutFile '%MODS_DIR%\%VOICECHAT_JAR%'"
) ELSE (
    echo Voice Chat mod ya existe, skipping.
)

echo.
echo Instancia creada! Abre Prism Launcher, selecciona "%INSTANCE_NAME%" y dale Launch.
echo Luego ve a Multiplayer ^> Add Server y pon: %SERVER_IP%
echo.

REM ── Intentar abrir Prism Launcher ──
SET FOUND_PRISM=
IF EXIST "%LOCALAPPDATA%\Programs\PrismLauncher\prismlauncher.exe" SET "FOUND_PRISM=%LOCALAPPDATA%\Programs\PrismLauncher\prismlauncher.exe"
IF EXIST "C:\Program Files\Prism Launcher\prismlauncher.exe" SET "FOUND_PRISM=C:\Program Files\Prism Launcher\prismlauncher.exe"
IF EXIST "C:\Program Files (x86)\Prism Launcher\prismlauncher.exe" SET "FOUND_PRISM=C:\Program Files (x86)\Prism Launcher\prismlauncher.exe"
IF EXIST "%LOCALAPPDATA%\PrismLauncher\prismlauncher.exe" SET "FOUND_PRISM=%LOCALAPPDATA%\PrismLauncher\prismlauncher.exe"

IF DEFINED FOUND_PRISM (
    echo Abriendo Prism Launcher...
    start "" "%FOUND_PRISM%"
) ELSE (
    echo No se encontro PrismLauncher.exe - abrelo manualmente.
)

pause
