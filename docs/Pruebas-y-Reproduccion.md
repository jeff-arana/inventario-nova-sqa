# Reproducción técnica de las comprobaciones y capturas

## Preparación del entorno

Con Node.js 20 o superior y Docker Desktop instalados, abro la carpeta del proyecto en Visual Studio Code y reviso que el archivo `.env` contenga contraseñas locales propias. Desde el terminal ejecuto `docker compose up --build -d` y verifico que el cliente responda en `http://localhost:8080` y que el servicio API responda en `http://localhost:3001/api/health`.

Antes de configurar MySQL no se deben publicar contraseñas dentro de capturas ni subir el archivo `.env` al control de versiones. Las credenciales del contenedor son para desarrollo local; un servidor público necesita secretos de producción, autenticación y controles adicionales.

## Comprobación local mínima ya reproducida

```bash
npm run test:core
npm run check --prefix backend
```

El primer comando ejecuta nueve pruebas independientes con el módulo integrado `node:test`. El segundo revisa la sintaxis de cinco archivos del backend. Estos procedimientos fueron repetidos en el entorno de preparación y finalizaron sin errores. El archivo `evidencias_verificables/` contiene un registro de las salidas.

## Comprobación completa del proyecto

```bash
npm install --prefix backend
npm install --prefix frontend
npm run lint
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
node scripts/check-coverage.mjs
npm run build --prefix frontend
```

Para la prueba de MySQL se requiere el esquema cargado y las variables de conexión correspondientes. El script de cobertura solicita los archivos `backend/coverage/coverage-summary.json` y `frontend/coverage/coverage-summary.json`. Compara por separado líneas, ramas, funciones y sentencias de cada capa contra 60 %. Si un reporte falta o un valor es menor, el proceso termina con error.

## Ejecución del pipeline sobre GitHub

Primero publico el repositorio con sus dependencias y archivos de configuración. Creo una rama diferente a `main`, incorporo un cambio pequeño con su prueba y lo subo. Desde GitHub abro un pull request dirigido a `main`. La pestaña Checks permite consultar el resultado de build, test, analyze y report. Para impedir fusiones que no cumplan se deben activar las reglas de protección en Settings, incluyendo los checks requeridos. Esta configuración no se activa automáticamente por existir el YAML.

## Calidad en SonarQube Cloud

La integración solicita un proyecto, una organización y un token. Los secretos se guardan en la configuración de GitHub y no en el código. El análisis solo se ejecuta cuando están definidas las tres variables requeridas. Un panel de Sonar real debe mostrar la versión o commit analizado, cobertura, incidencias y duplicación; sin ese análisis, esos valores permanecen no medidos.

## Cómo se obtuvieron las capturas locales

Las imágenes del panel de inventario, edición, alta y JSON se tomaron en Chromium usando una vista ejecutable incluida en `herramientas/visualizacion_local/`. Esa vista usa un servidor Python con SQLite y datos de `database/init.sql`. De esta forma se observan acciones reales de la interfaz local, pero no se confunde el entorno de visualización con el backend principal Express/MySQL.

## Guía breve de captura verificable

Para una nueva evidencia conviene mostrar la ventana completa, la URL local o la aplicación abierta, el resultado que interesa y, cuando corresponda, el comando que lo produjo. Cada captura se asocia con un nombre consecutivo, una operación concreta, una fecha y el archivo de código relacionado. Evito publicar tokens, credenciales o datos personales dentro de la pantalla.
