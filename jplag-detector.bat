@echo off
REM Script para ejecutar JPlag en español para UpnAssist
REM Autor: UpnAssist Team
REM Fecha: 4 de junio de 2025

echo Detector de Plagios JPlag - UpnAssist
echo =================================

set JPLAG_JAR=d:\UpnAssist\JPlag\cli\target\jplag-cli-6.1.0-jar-with-dependencies.jar

IF NOT EXIST "%JPLAG_JAR%" (
  echo ERROR: No se encontró el archivo JAR de JPlag.
  echo Por favor, compila JPlag primero usando Maven.
  exit /b 1
)

IF "%~1"=="" (
  echo Uso: %0 [ruta_carpeta_entregas] [opciones]
  echo.
  echo Opciones disponibles:
  echo   -l lenguaje       : java, python, cpp, csharp, etc. (por defecto: java)
  echo   -t umbral         : umbral de similitud (0.0-1.0) (por defecto: 0.5)
  echo   -m min-tokens     : número mínimo de tokens (por defecto: depende del lenguaje)
  echo   -r ruta_resultado : ruta donde guardar el resultado
  echo.
  echo Ejemplo: %0 d:\UpnAssist\entregas -l java -t 0.7
  exit /b 0
)

set SUBMISSIONS_PATH=%~1
shift

echo Analizando entregas en: %SUBMISSIONS_PATH%
java -jar "%JPLAG_JAR%" %* "%SUBMISSIONS_PATH%"

IF %ERRORLEVEL% NEQ 0 (
  echo Error al ejecutar JPlag. Código de error: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

echo.
echo Análisis completado exitosamente.
echo.
