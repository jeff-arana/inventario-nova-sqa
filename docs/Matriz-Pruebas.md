# Matriz de pruebas y registro de comprobaciones

## Estrategia de selección

Organicé las pruebas por comportamiento observable. Cada caso identifica una entrada, el resultado esperado, la capa involucrada y la condición en la que puede aprobarse. Incluí rutas normales, datos extremos, errores de negocio, operaciones sobre registros inexistentes y comprobaciones de estabilidad después de modificaciones.

## Matriz de pruebas unitarias

| ID | Componente | Entrada | Resultado esperado | Registro |
|---|---|---|---|---|
| UT-01 | Validación general | Producto con SKU TEC-101, precio 1500, stock 5 | Aceptar producto | Aprobado local |
| UT-02 | Precio | Valor -1 | Rechazo por precio no válido | Aprobado local |
| UT-03 | Existencia | Valor 1.1 | Rechazo por cantidad fraccionaria | Aprobado local |
| UT-04 | SKU | Código en minúsculas | Normalización a mayúsculas | Aprobado local |
| UT-05 | Estado stock | 0 unidades | Agotado | Aprobado local |
| UT-06 | Estado stock | 3 unidades | Bajo | Aprobado local |
| UT-07 | Estado stock | 12 unidades | Disponible | Aprobado local |
| UT-08 | ID de ruta | Cadena 8 | Identificador entero válido | Aprobado local |
| UT-09 | ID de ruta | Cadena 8.1 | Rechazo de identificador | Aprobado local |

![FIG:07_ejecucion_9_pruebas_node.png]

## Matriz de integración HTTP

| ID | Método y ruta | Entrada o precondición | Respuesta esperada | Estado |
|---|---|---|---|---|
| API-01 | GET /api/health | Aplicación disponible | 200, respuesta de salud | Implementado en Supertest |
| API-02 | GET /api/products | Sin filtro | 200, lista JSON | Implementado en Supertest |
| API-03 | GET /api/products?search=Mouse | Texto conocido | 200, lista filtrada | Implementado en Supertest |
| API-04 | GET /api/products/7 | ID existente | 200, objeto de producto | Implementado en Supertest |
| API-05 | POST /api/products | Producto válido | 201, producto creado | Implementado en Supertest |
| API-06 | PUT /api/products/7 | Cambios correctos | 200, producto actualizado | Implementado en Supertest |
| API-07 | DELETE /api/products/7 | ID existente | 204, sin contenido | Implementado en Supertest |
| API-08 | POST /api/products | Precio negativo | 422, error de validación | Implementado en Supertest |
| API-09 | GET /api/products/abc | ID mal formado | 400, error de entrada | Implementado en Supertest |
| API-10 | GET /api/products/999999 | ID inexistente | 404, no encontrado | Implementado en Supertest |
| API-11 | POST /api/products | SKU ya registrado | 409, conflicto | Implementado en Supertest |
| API-12 | POST /api/products | JSON mal formado | 400, mensaje genérico | Comportamiento definido en backend |

## Matriz de base de datos e interfaz

| ID | Capa | Procedimiento | Resultado esperado | Estado |
|---|---|---|---|---|
| DB-01 | MySQL | Crear → leer → actualizar → borrar | Registro íntegro en todas las fases | Prueba configurada para CI |
| DB-02 | MySQL | Intentar SKU repetido | Rechazo por clave única | Restricción SQL configurada |
| UI-01 | React | Mostrar productos con stock bajo | Etiqueta Bajo | Test creado |
| UI-02 | React | Lista vacía | Mensaje de catálogo vacío | Test creado |
| UI-03 | React | Pulsar Editar | Abre la edición correspondiente | Test creado |
| UI-04 | React | SKU con caracteres no válidos | Error de formulario | Test creado |
| UI-05 | React | Formulario correcto | Envía producto al handler | Test creado |

## Matriz de regresión y quality gates

| ID | Situación de riesgo | Resultado esperado | Control |
|---|---|---|---|
| REG-01 | SKU repetido tras modificar servicios | HTTP 409 | Jest + Supertest |
| REG-02 | Error inesperado del servidor | HTTP 500 sin detalle interno | Jest + Supertest |
| REG-03 | Stock 0 tras cambios de presentación | Estado Agotado | Node test + UI |
| REG-04 | ID decimal tras refactorización | Rechazo del ID | Node test |
| QG-01 | Cobertura por debajo de 60 % | Salida distinta de cero | scripts/check-coverage.mjs |
| QG-02 | Error de ESLint | analyze falla | npm run lint |
| QG-03 | Error de build | build falla | npm run build |
| BR-01 | Pull request sin checks requeridos | No debe integrarse | Protección de rama en GitHub |

![FIG:09_workflow_ci_configurado.png]

## Registro de resultados

El 5 de noviembre de 2026 ejecuté `npm run test:core` en Node 22.16.0. La salida informa 9 pruebas ejecutadas, 9 aprobadas, 0 fallidas y 0 omitidas. También ejecuté `npm run check --prefix backend` y la comprobación de sintaxis terminó con código de salida cero. Los archivos de texto completos se conservan en `evidencias_verificables/`.

![FIG:08_revision_sintaxis_backend.png]

Estos registros permiten verificar el módulo principal de reglas de negocio y la sintaxis del servidor. Para identificar resultados de integración y de interfaz deben ejecutarse adicionalmente Jest, Vitest y el servicio de MySQL, por lo que no atribuyo resultados numéricos a esas suites en este registro.

## Lectura de resultados y acciones

Una prueba aprobada demuestra que el caso contemplado produjo la salida esperada; no significa que la función esté libre de cualquier defecto. Por eso la matriz combina operaciones correctas, entradas inválidas y errores de infraestructura. La comprobación de código estático añade otra perspectiva y los umbrales de cobertura ayudan a identificar código que no recibió ejercicio suficiente.
