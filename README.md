# Inventario Nova | Calidad de software y CI/CD

Sistema de inventario con frontend React, API Express y almacenamiento MySQL. Incluye pruebas unitarias, de API, integración de base de datos y componentes, junto con una configuración CI/CD de cuatro etapas.

## Funcionamiento

Se pueden crear, consultar, modificar y eliminar productos. El modelo valida el SKU, los precios y las existencias. Los registros de muestra facilitan revisar el catálogo. Las capturas y el análisis técnico están organizados en `docs/` y `capturas/`.

## Ejecutar en Windows o Linux

```bash
# Validación rápida sin descargar dependencias
npm run test:core
npm run check --prefix backend

# Instalación de paquetes para suites y frontend
npm install --prefix backend
npm install --prefix frontend

# Aplicación con Docker
# configurar variables basadas en .env.example
docker compose up --build -d
```

## Pruebas y calidad

```bash
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
npm run lint
node scripts/check-coverage.mjs
```

El mínimo configurado es 60 % para líneas, ramas, funciones y sentencias de backend y frontend. El workflow se encuentra en `.github/workflows/ci.yml`, con etapas `build`, `test`, `analyze` y `report`. SonarQube Cloud y la protección de `main` requieren habilitación en una cuenta GitHub propia.

## Documentos y evidencia

- `docs/SQA-Plan.md`: política de calidad, riesgos, criterios y métodos.
- `docs/Matriz-Pruebas.md`: casos unitarios, API, base de datos, UI y regresión.
- `docs/Linea-Base-Calidad.md`: estado inicial y reglas de interpretación.
- `docs/Reporte-Mejora.md`: cambios técnicos, indicadores y próximos controles.
- `docs/Manual-Tecnico.md`: arquitectura, comandos, rutas y soporte.
- `docs/Manual-Usuario.md`: operaciones del catálogo.
- `docs/Evidencias.md`: imágenes relacionadas con sus fuentes.

**Comprobación local registrada:** 9/9 pruebas de validación aprobaron y el backend pasó revisión de sintaxis. Las capturas de GitHub/Sonar y los indicadores comparativos utilizan datos de referencia hasta contar con una ejecución real identificable.

## Documentación organizada

Los documentos de lectura y los reportes están en `Documentos/` dentro del ZIP principal. Los registros locales se preservan en `evidencias_verificables/`. Los indicadores de un servicio remoto no están medidos hasta que se ejecute el workflow en una cuenta GitHub conectada.


## Inicio sencillo en Windows
Consulta `LEEME_PRIMERO_PASOS.txt` y ejecuta `00_VERIFICAR_WINDOWS.cmd` antes de `01_SUBIR_A_GITHUB.cmd`.

## Control de calidad

El proyecto Inventario Nova incorpora pruebas automatizadas, análisis estático y medición de cobertura mediante GitHub Actions y SonarQube Cloud.

El pipeline verifica las etapas build, test, analyze y report antes de integrar cambios al proyecto.
