@echo off
title Actualizar catálogo de productos - Distribuidora Multi Repuestos GZ

:: Ir a la carpeta donde está este .bat
cd /d "%~dp0"

echo ============================================
echo  ACTUALIZANDO CATALOGO DE PRODUCTOS
echo ============================================
echo.

:: Comprobar que exista el script de generación
if not exist "tools\generate-products.mjs" (
    echo ⚠️ No se encontró el archivo tools\generate-products.mjs
    echo Verifica que el proyecto esté completo.
    echo.
    pause
    exit /b
)

:: Opcional: comprobar que Node está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ⚠️ No se encontró 'node' en este equipo.
    echo Es necesario tener Node.js instalado para actualizar el catalogo.
    echo Descarga desde: https://nodejs.org
    echo.
    pause
    exit /b
)

echo Ejecutando script de actualización...
echo.

node tools\generate-products.mjs

if errorlevel 1 (
    echo.
    echo ⚠️ Ocurrió un error al generar el catalogo.
    echo Revisa los mensajes de arriba (nombres de imagen, precios, etc.).
    echo.
) else (
    echo.
    echo ✅ Catalogo generado correctamente.
    echo Revise js\products-data.js o abra la web para ver los cambios.
    echo.
)

pause
