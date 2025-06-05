# Script para ejecutar JPlag en español para UpnAssist
# Autor: UpnAssist Team
# Fecha: 4 de junio de 2025

$jplagJar = "d:\UpnAssist\JPlag\cli\target\jplag-cli-6.1.0-jar-with-dependencies.jar"

function Show-Usage {
    Write-Host "Detector de Plagios JPlag - UpnAssist" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Uso: .\jplag-detector.ps1 -Path <ruta_carpeta_entregas> [opciones]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones disponibles:" -ForegroundColor Yellow
    Write-Host "  -Language <lenguaje>    : java, python, cpp, csharp, etc. (por defecto: java)"
    Write-Host "  -Threshold <umbral>     : umbral de similitud (0.0-1.0) (por defecto: 0.5)"
    Write-Host "  -MinTokens <tokens>     : número mínimo de tokens (por defecto: depende del lenguaje)"
    Write-Host "  -ResultPath <ruta>      : ruta donde guardar el resultado"
    Write-Host ""
    Write-Host "Ejemplo: .\jplag-detector.ps1 -Path d:\UpnAssist\entregas -Language java -Threshold 0.7" -ForegroundColor Green
}

function Start-JPlagAnalysis {
    param (
        [Parameter(Mandatory=$true)]
        [string]$Path,
        
        [Parameter(Mandatory=$false)]
        [string]$Language = "java",
        
        [Parameter(Mandatory=$false)]
        [double]$Threshold = 0.5,
        
        [Parameter(Mandatory=$false)]
        [int]$MinTokens = 0,
        
        [Parameter(Mandatory=$false)]
        [string]$ResultPath = ""
    )
    
    if (-not (Test-Path $jplagJar)) {
        Write-Host "ERROR: No se encontró el archivo JAR de JPlag en $jplagJar" -ForegroundColor Red
        Write-Host "Por favor, compila JPlag primero usando Maven." -ForegroundColor Red
        return
    }
    
    if (-not (Test-Path $Path)) {
        Write-Host "ERROR: La ruta especificada no existe: $Path" -ForegroundColor Red
        return
    }
    
    $command = "java -jar `"$jplagJar`" -l $Language"
    
    if ($Threshold -gt 0) {
        $command += " -t $Threshold"
    }
    
    if ($MinTokens -gt 0) {
        $command += " -m $MinTokens"
    }
    
    if ($ResultPath -ne "") {
        $command += " -r `"$ResultPath`""
    }
    
    $command += " `"$Path`""
    
    Write-Host "Analizando entregas en: $Path" -ForegroundColor Cyan
    Write-Host "Ejecutando: $command" -ForegroundColor Gray
    
    Invoke-Expression $command
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al ejecutar JPlag. Código de error: $LASTEXITCODE" -ForegroundColor Red
    } else {
        Write-Host "Análisis completado exitosamente." -ForegroundColor Green
    }
}

# Si no hay parámetros, mostrar la ayuda
if ($args.Count -eq 0) {
    Show-Usage
    return
}

# Parsear los parámetros
$params = @{}
for ($i = 0; $i -lt $args.Count; $i++) {
    switch ($args[$i]) {
        "-Path" { $params.Path = $args[++$i] }
        "-Language" { $params.Language = $args[++$i] }
        "-Threshold" { $params.Threshold = [double]$args[++$i] }
        "-MinTokens" { $params.MinTokens = [int]$args[++$i] }
        "-ResultPath" { $params.ResultPath = $args[++$i] }
        "-Help" { Show-Usage; return }
        default {
            if (-not $params.ContainsKey("Path")) {
                $params.Path = $args[$i]
            } else {
                Write-Host "Parámetro desconocido: $($args[$i])" -ForegroundColor Red
                Show-Usage
                return
            }
        }
    }
}

# Verificar que tenemos al menos la ruta
if (-not $params.ContainsKey("Path")) {
    Write-Host "ERROR: Debe especificar la ruta de las entregas" -ForegroundColor Red
    Show-Usage
    return
}

# Ejecutar el análisis
Start-JPlagAnalysis @params
