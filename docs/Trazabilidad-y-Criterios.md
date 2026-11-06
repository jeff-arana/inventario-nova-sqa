# Trazabilidad de requisitos, controles y evidencias

## Criterio de trazabilidad

La trazabilidad relaciona un comportamiento observable con la unidad de código, el control preparado y la evidencia disponible. Cuando una comprobación está escrita pero no existe salida verificable de ejecución, se identifica como «implementada / pendiente de ejecución»; no se confunde con un caso aprobado.

| ID | Comportamiento o control | Ubicación principal | Prueba o control | Evidencia registrada |
|---|---|---|---|---|
| RF-01 | Listar productos | `app.js`, `services.js` | API-02 | Captura 01, vista local |
| RF-02 | Buscar por nombre, SKU o categoría | `services.js` | API-03 | Captura 02, vista local |
| RF-03 | Registrar un producto | `app.js`, `services.js` | API-05 | Captura 05, vista local |
| RF-04 | Editar producto | `app.js`, `services.js` | API-06 | Capturas 03 y 04, vista local |
| RF-05 | Eliminar producto | `app.js`, `services.js` | API-07 | Prueba implementada, no observada en capturas |
| RN-01 | Rechazar precio negativo | `validation.js` | UT-02 | Captura 07, pruebas Node aprobadas |
| RN-02 | Rechazar stock fraccionario | `validation.js` | UT-03 | Captura 07, pruebas Node aprobadas |
| RN-03 | Normalizar SKU | `validation.js` | UT-04 | Captura 07, pruebas Node aprobadas |
| RN-04 | Establecer estado de stock | `validation.js` | UT-05 a UT-07 | Captura 07, pruebas Node aprobadas |
| RN-05 | Rechazar ID inválido | `validation.js` | UT-08 a UT-09 | Captura 07, pruebas Node aprobadas |
| RN-06 | Unicidad de SKU | `init.sql` y API | DB-02, API-11 | Restricción en SQL; suites por ejecutar |
| CI-01 | Compilar frontend | `ci.yml` | Job build | Captura 09, configuración visible |
| CI-02 | Automatizar pruebas | `ci.yml` | Job test | Configurado; ejecución remota pendiente |
| CI-03 | Análisis estático y cobertura | `ci.yml` | Job analyze | Configurado; ejecución remota pendiente |
| CI-04 | Resumir controles | `ci.yml` | Job report | Configurado; ejecución remota pendiente |
| CI-05 | Protección de main | GitHub Rulesets | Configuración administrativa | No activada desde este entorno |
| QA-01 | Cobertura mínima 60 % | `check-coverage.mjs` | Quality gate | Umbral configurado; métricas globales no medidas |

## Interpretación de estados

«Aprobado local» significa que existe salida de comando reproducible en los archivos `evidencias_verificables/`. «Observado en navegador» se refiere a la sesión local con el servicio de visualización incluido en `herramientas/visualizacion_local`. «Configurado» indica que existe el archivo necesario, pero no equivale a una ejecución en GitHub. «Pendiente de ejecución» significa que todavía debe obtenerse una salida del entorno objetivo para atribuir un resultado.

## Criterios de aceptación

Una modificación no se considera suficientemente verificada por el hecho de compilar. La revisión exige aprobar pruebas relevantes de su capa, no reducir la cobertura por debajo del mínimo, evitar fallos de lint y documentar el comportamiento visible. El resultado definitivo se debe registrar junto con una versión de código concreta para permitir comparaciones posteriores.
