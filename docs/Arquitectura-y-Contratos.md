# Arquitectura funcional y especificaciones de Inventario Nova

## Panorama de componentes

Inventario Nova organiza la consulta de productos en tres responsabilidades diferenciadas. React controla la interfaz, expresa acciones y valida la interacción inmediata. Express recibe solicitudes HTTP, valida sus datos e invoca la capa de servicios. MySQL almacena los artículos mediante una tabla con restricciones y consultas parametrizadas. Esta separación evita que el navegador tenga acceso directo a la base de datos y permite probar reglas de negocio sin levantar toda la infraestructura.

| Capa | Carpeta o archivo | Función principal | Evidencia o mecanismo de comprobación |
|---|---|---|---|
| Interfaz | `frontend/src/` | Tabla, formularios, búsqueda y estados de disponibilidad | React Testing Library y observación del panel |
| Rutas HTTP | `backend/src/app.js` | Enrutamiento, códigos HTTP y control de errores | Casos de API con Supertest |
| Reglas | `backend/src/validation.js` | SKU, nombre, categoría, precio, stock e ID | 9 pruebas Node ejecutadas |
| Datos | `backend/src/services.js` | Operaciones SQL y consultas parametrizadas | Pruebas de servicios y MySQL en CI |
| Almacenamiento | `database/init.sql` | Esquema, unicidad del SKU y datos iniciales | Inspección SQL y suite de integración |
| Automatización | `.github/workflows/ci.yml` | Build, test, analyze y report | Configuración inspeccionada; ejecución remota pendiente |

## Modelo de producto

El objeto de producto contiene `id`, `sku`, `name`, `category`, `price`, `stock`, `created_at` y `updated_at`. El código SKU identifica el artículo dentro del catálogo y debe ser único. La fecha de creación permite conocer el origen del registro y la fecha de actualización refleja la modificación más reciente. El estado de disponibilidad se calcula a partir de `stock`: cero indica «Agotado», entre uno y cinco indica «Bajo», y más de cinco indica «Disponible».

## Reglas exactas de entrada

| Campo | Restricción aplicada | Ejemplo aceptado | Ejemplo rechazado |
|---|---|---|---|
| `name` | Texto de 3 a 120 caracteres luego de recortar espacios | `Monitor LED 24` | `TV` |
| `sku` | 4–24 caracteres, letras A–Z, números o guiones | `TEC-023` | `@ABC` |
| `category` | Texto de 3 a 60 caracteres | `Periféricos` | `PC` |
| `price` | Número finito de 0 a 1,000,000 | `899.50` | `-20` |
| `stock` | Entero de 0 a 1,000,000 | `0` | `3.5` |
| ID de ruta | Entero seguro positivo con forma decimal canónica | `12` | `12.0`, `abc` |

Estas reglas se verifican en el servidor, aunque el formulario tenga validaciones propias. Un valor cero en precio o existencia es admisible; por eso no se utiliza una comprobación basada simplemente en que el valor sea verdadero o falso.

## Ejemplo de recorrido de creación

El usuario completa el formulario React y presiona Guardar. El cliente construye un objeto JSON y realiza POST hacia `/api/products`. Express recibe el cuerpo, comprueba las reglas y responde 422 si algún campo no cumple. Si es válido, el servicio ejecuta `INSERT` con parámetros. La tabla MySQL impide repetir el SKU mediante una restricción UNIQUE. Un registro correcto produce HTTP 201; si el SKU ya estaba registrado, el manejador transforma el error de base de datos en HTTP 409.

## Contrato de rutas

| Operación | Método | URL | Resultado de éxito | Error controlado |
|---|---|---|---|---|
| Estado del servicio | GET | `/api/health` | 200 y estado `ok` | 500 ante error de infraestructura |
| Listar o buscar | GET | `/api/products?search=mouse` | 200 y `{data,count}` | 500 ante fallo inesperado |
| Obtener uno | GET | `/api/products/:id` | 200 y `{data}` | 400 por ID inválido; 404 inexistente |
| Crear | POST | `/api/products` | 201 y `{data}` | 422 inválido; 409 SKU repetido |
| Actualizar | PUT | `/api/products/:id` | 200 y `{data}` | 400, 404, 409 o 422 |
| Eliminar | DELETE | `/api/products/:id` | 204 sin cuerpo | 400 o 404 |

## Ejemplos de interacción HTTP

```bash
curl http://localhost:3001/api/health
curl 'http://localhost:3001/api/products?search=Kingston'
curl -X POST http://localhost:3001/api/products \
  -H 'Content-Type: application/json' \
  -d '{"sku":"TEC-120","name":"Teclado USB","category":"Accesorios","price":175,"stock":12}'
```

La segunda consulta devuelve un objeto de lista con `data` y `count`; la tercera crea un registro nuevo si la API y MySQL están ejecutándose y los datos no entran en conflicto. En Windows, los mismos comandos pueden ejecutarse desde Git Bash o mediante herramientas HTTP equivalentes.

## Diseño de los datos iniciales

`database/init.sql` crea la tabla de productos e incorpora 12 registros tecnológicos. Se dispone de equipos de cómputo, accesorios, redes y almacenamiento; las existencias incluyen artículos agotados y con baja disponibilidad. Los importes se presentan en quetzales. Los registros no sustituyen un catálogo comercial real y pueden modificarse en una instalación de prueba.

## Decisiones de diseño y sus efectos

| Decisión | Beneficio | Compensación |
|---|---|---|
| Reglas independientes de Express | Pruebas unitarias rápidas | Deben mantenerse sincronizadas con la UI |
| SQL parametrizado | Evita concatenar valores del usuario en consultas | Requiere servicio de acceso uniforme |
| SKU único | Impide duplicidad accidental | Cambiar SKU puede generar conflictos históricos |
| Respuestas HTTP normalizadas | Facilita mensajes consistentes | Exige manejo explícito de errores |
| Datos de inicio | Reproducción sencilla de escenarios | El volumen persistente conserva cambios anteriores |
| Umbral de cobertura por capa | Evita ocultar un frontend débil en un promedio total | Exige revisar cuatro dimensiones de dos informes |

## Límites conocidos

El backend previsto usa MySQL 8 y no incorpora autenticación ni permisos multiusuario. La aplicación está pensada para fines académicos y funcionamiento local hasta que se agregue seguridad de acceso. La vista local usada para las capturas de CRUD utiliza Python y SQLite y sirve para observar operaciones en un navegador; no demuestra que esas mismas capturas provengan de Express + MySQL.
