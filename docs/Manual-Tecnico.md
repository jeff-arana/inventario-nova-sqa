# Manual técnico y arquitectura de Inventario Nova

## Arquitectura de tres capas

Inventario Nova utiliza React con Vite como interfaz, Express con Node.js para los endpoints y MySQL 8.4 como persistencia. El frontend no consulta la base de datos directamente: envía peticiones HTTP a la API; la API valida la entrada y delega la operación de almacenamiento a un servicio que utiliza mysql2/promise.

![FIG:09_workflow_ci_configurado.png]

## Estructura del proyecto

```text
InventarioNova_SQA/
  backend/src/          API Express, reglas y servicios SQL
  backend/tests/        pruebas de backend y base de datos
  frontend/src/         componentes React y pruebas de interfaz
  database/init.sql     esquema MySQL y registros iniciales
  .github/workflows/    integración continua
  scripts/              validación de cobertura y configuración
  docs/                 SQA, manuales y reportes
  capturas/             imágenes de interfaz y controles
  evidencias_verificables/ registros de comandos locales
```

## Modelo de datos

La tabla `products` guarda `id` entero autoincremental, `sku` único de hasta 24 caracteres, `name` hasta 120, `category` hasta 60, `price` decimal (10,2), `stock` entero sin signo y marcas de tiempo automáticas. El SKU permite identificar un producto de manera comercial, mientras el ID se reserva como clave técnica. La restricción UNIQUE protege la integridad incluso si se envían solicitudes repetidas desde clientes diferentes.

## Contrato de API

| Método | Ruta | Propósito | Respuestas principales |
|---|---|---|---|
| GET | /api/health | Comprobar disponibilidad básica | 200 |
| GET | /api/products | Consultar productos, opcional search | 200 |
| GET | /api/products/:id | Consultar un producto | 200, 400, 404 |
| POST | /api/products | Registrar producto | 201, 422, 409 |
| PUT | /api/products/:id | Modificar producto | 200, 400, 404, 422, 409 |
| DELETE | /api/products/:id | Eliminar producto | 204, 400, 404 |

El backend comprueba el tipo y rango del precio y de la cantidad, el formato de SKU y el identificador de ruta. En los errores de base de datos evita exponer mensajes SQL al navegador. Para el listado limita y normaliza el término de búsqueda y lo envía por parámetros separados.

## Variables de entorno

| Variable | Ejemplo de uso | Descripción |
|---|---|---|
| DB_HOST | mysql | Nombre del servicio MySQL dentro de Docker |
| DB_PORT | 3306 | Puerto de la base de datos |
| DB_USER | nova_user | Usuario con permisos acotados |
| DB_PASSWORD | Se define localmente | Contraseña que no debe subirse a Git |
| DB_NAME | inventario_nova | Nombre del esquema |
| PORT | 3001 | Puerto HTTP del servidor |
| NODE_ENV | test / production | Modo de ejecución |
| SONAR_TOKEN | Secreto de GitHub | Autorización del análisis externo |

## Instalación local

Primero instalo Node.js 20 o superior y Docker Desktop. En un entorno de consola puedo descargar dependencias con `npm install --prefix backend` y `npm install --prefix frontend`. Para levantar los tres servicios con contenedores utilizo `docker compose up --build -d`. La imagen frontend contiene Nginx y sirve el cliente; el servidor API comunica con MySQL según las variables configuradas en Docker Compose. Las URLs deben verificarse con el archivo compose efectivo, no suponerse de manera genérica.

Los registros iniciales provienen de `database/init.sql`. Incluyen doce productos de tecnología con precios en quetzales y existencias variadas, entre ellos laptop, monitor, mouse, impresora y componentes. Estos registros facilitan revisar búsquedas y estados de stock desde la interfaz.

![FIG:01_inventario_en_navegador.png]

## Comandos de desarrollo y pruebas

```bash
npm run test:core
npm run check --prefix backend
npm run build --prefix frontend
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
npm run lint
node scripts/check-coverage.mjs
```

El primer comando no necesita instalaciones externas y verifica nueve casos puros. Los restantes exigen instalar dependencias y, en la prueba de integración de base de datos, configurar MySQL. Las suites Jest/Vitest generan reportes `coverage` que el script de control consulta para comparar valores reales con los mínimos.

## Pipeline de integración continua

GitHub Actions inicia el workflow en pushes a `main` o `develop`, pull requests dirigidos a `main` o por ejecución manual. `build` comprueba backend y compila React. `test` arranca un servicio MySQL y ejecuta las pruebas con cobertura. `analyze` evalúa ESLint y los resúmenes de cobertura e invoca Sonar cuando existen credenciales configuradas. `report` reúne los estados y falla si build, test o analyze fallaron.

La validación de cobertura por capa se hace sobre archivos seleccionados expresamente en las configuraciones; no debe confundirse con el cien por ciento de cada archivo del repositorio. Un cambio en la lista de archivos cubiertos también debe evaluarse durante revisión.

![FIG:09_workflow_ci_configurado.png]

## Seguridad básica y límites

Las consultas usan parámetros y el servidor centraliza las validaciones. No se almacena el token de Sonar dentro del código y el `.gitignore` protege los archivos de entorno. No obstante, esta versión de Inventario Nova no implementa autenticación, roles ni autorización de edición por usuario; para un ambiente con usuarios reales sería necesario agregarlos antes de exponer la API públicamente. Tampoco debe tratarse el sistema como una solución de facturación o comercial completa.

## Procedimiento de mantenimiento

Al recibir un reporte de defecto verifico primero el síntoma, obtengo un caso reproducible y creo una rama aislada. Agrego o actualizo una prueba que represente el fallo, modifico el código, ejecuto las suites y abro un PR. Si aparece un problema en la etapa analyze, reviso los archivos de cobertura o los mensajes de ESLint. Antes de fusionar confirmo que la revisión humana y los checks estén satisfechos.

## Resolución de problemas frecuentes

| Síntoma | Posible causa | Acción |
|---|---|---|
| El frontend no muestra productos | API inaccesible | Verificar contenedor backend y URL de API |
| Error al conectar MySQL | Credenciales o servicio incompleto | Revisar `.env`, logs y healthcheck |
| POST devuelve 422 | Validación rechazada | Revisar SKU, precio y stock |
| POST devuelve 409 | SKU existente | Consultar catálogo y asignar SKU único |
| Job test falla | Test o BD | Leer logs y reproducir prueba concreta |
| Job analyze falla | Lint o cobertura | Revisar salida de ESLint y JSON summary |
| Sonar no aparece | Credenciales no configuradas | Crear proyecto y variables/secreto |
