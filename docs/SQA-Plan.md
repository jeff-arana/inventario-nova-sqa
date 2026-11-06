# Plan de aseguramiento de la calidad de Inventario Nova

## 1. Contexto y propósito

Inventario Nova es una aplicación de control de productos para un negocio de tecnología. Centraliza las entradas del catálogo, los precios y las existencias. Al trabajar con información de inventario, una operación incorrecta puede duplicar un artículo, producir precios incoherentes o indicar disponibilidad donde ya no existe. Por eso incorporé un proceso de calidad que acompaña cada modificación del código y detecta problemas antes de integrar nuevas versiones.

El propósito del plan es vincular los requisitos del sistema con actividades de prevención, verificación y mejora. El objetivo no se limita a encontrar errores al final: busco reducir la posibilidad de introducirlos mediante validaciones, pruebas automáticas, análisis estático, revisión de cambios y criterios de aceptación conocidos desde el inicio.

## 2. Descripción funcional y límites

La aplicación gestiona productos mediante operaciones de creación, consulta, edición y eliminación. Cada producto contiene identificador numérico, SKU único, nombre, categoría, precio, unidades disponibles y marcas de tiempo. El catálogo admite búsquedas y presenta estados de inventario con un umbral de reposición. El cliente React comunica las acciones al servidor Express, mientras MySQL conserva la información.

El análisis de calidad se concentra en reglas de negocio, endpoints REST, interacción básica de la interfaz, persistencia, cobertura y control de cambios. No se considera dentro de esta versión la gestión comercial de ventas, autenticación de múltiples roles ni un módulo contable. Tampoco interpreto los tiempos de respuesta sin mediciones de rendimiento independientes.

## 3. Referencia arquitectónica y adaptación

Para organizar la solución tomé como punto de partida el patrón de una aplicación CRUD con React, Express y MySQL, compatible con la referencia pública DMS-ranil/react-mysql-crud-template. En la carpeta actual se incluye una implementación académica reorganizada; no existe evidencia de que los archivos correspondan a un fork de un commit específico del repositorio externo. La parte más importante de la intervención es el conjunto de validaciones, tests y reglas de integración continua que complementan ese patrón.

## 4. Criterios de calidad

| Atributo | Cómo lo evalué | Condición aceptable |
|---|---|---|
| Adecuación funcional | Casos CRUD, búsqueda y manejo de errores | Respuestas y estados correctos |
| Fiabilidad | Casos negativos y pruebas de regresión | Fallos detectados por la suite |
| Seguridad básica | Validación, sentencias parametrizadas y errores genéricos | Entradas incorrectas rechazadas |
| Mantenibilidad | Separación de servicios, ESLint y revisión | Sin errores bloqueantes de estilo |
| Testabilidad | Test unitario, integración, interfaz | Componentes y reglas comprobables |
| Cobertura | Reportes Jest y Vitest | ≥ 60 % en líneas, ramas, funciones y sentencias por capa |
| Trazabilidad | Commits, PR, checks y registros | Cambio relacionado con su resultado |

Utilizo ISO/IEC 25010 como marco conceptual de atributos de calidad e IEEE 730 como referencia organizativa del plan. No afirmo una certificación formal. Para la automatización empleo GitHub Actions y para la inspección del código se encuentra configurado ESLint, con la opción de integrar SonarQube Cloud.

## 5. Actividades de prevención, revisión y corrección

Antes de modificar una función, identifico qué comportamiento debe mantenerse y cuál debe cambiar. En la implementación aplico validaciones en el servidor incluso cuando la interfaz ya revisa los datos. Esto evita depender del navegador como única barrera. Después incorporo pruebas que incluyen rutas correctas y equivocadas, valores límite, identificadores inválidos, productos inexistentes y conflictos de SKU.

En el análisis estático verifico convenciones de código y sintaxis. Al finalizar una revisión, el pipeline debe producir reportes visibles. Un error de compilación, un test fallido, una violación de ESLint o un umbral de cobertura insuficiente impide considerar aprobado un cambio. Las correcciones se realizan en una rama y vuelven a evaluarse desde el principio.

## 6. Organización de las pruebas

| Nivel | Objeto evaluado | Tecnología | Riesgo que controla |
|---|---|---|---|
| Unitaria | Precios, SKU, existencias y estados | Node test / Jest | Reglas incorrectas |
| API | Códigos HTTP y JSON | Jest + Supertest | Respuestas incompletas |
| Integración de datos | Consultas y CRUD persistente | MySQL + Jest | Escrituras incoherentes |
| Regresión | Comportamientos previamente correctos | Jest / Vitest | Reaparición de defectos |
| Interfaz | Tabla, formulario, botones | React Testing Library | Flujos visuales rotos |
| Estática | Sintaxis y consistencia | Node check + ESLint | Defectos de estructura |

Los nueve casos ejecutables sin instalar paquetes se encuentran en `backend/tests/validation.node.test.mjs`. El resto de las suites están programadas, pero sus resultados completos dependen de contar con las dependencias instaladas, el servicio MySQL y el entorno de integración continua.

## 7. Quality gates y control de ramas

El mínimo de cobertura se fija en 60 % para líneas, sentencias, funciones y ramas, con comprobación independiente en frontend y backend. Se exige que el build termine correctamente, que todas las pruebas ejecutadas aprueben y que ESLint no detecte errores. `scripts/check-coverage.mjs` lee los resúmenes de ambas capas y rechaza el proceso cuando alguno de los ocho porcentajes cae por debajo del valor definido.

La rama principal debe utilizar pull requests y una política de revisión humana. GitHub permite requerir aprobaciones y checks antes de fusionar un cambio. La regla debe activarse con permisos de administración en el repositorio publicado; describirla en un archivo no la activa por sí solo. El análisis remoto de SonarQube Cloud requiere asimismo un proyecto y credenciales propias.

## 8. Responsabilidades y frecuencia

| Actividad | Responsable | Momento | Registro |
|---|---|---|---|
| Definir alcance del cambio | Desarrollador | Inicio de cada rama | Descripción de PR |
| Crear y mantener pruebas | Desarrollador | Durante implementación | Tests de código |
| Revisar cambios | Revisor autorizado | Antes del merge | Aprobación del PR |
| Ejecutar checks | GitHub Actions | Push / pull request | Jobs y artefactos |
| Evaluar deuda técnica | Desarrollador | Al cerrar un ciclo | Registro de mejoras |
| Actualizar indicadores | Desarrollador | Después de cada versión | Reportes de cobertura y análisis |

## 9. Registro de riesgos

| ID | Riesgo | Probabilidad | Impacto | Tratamiento |
|---|---|---|---|---|
| R01 | MySQL no disponible | Media | Alto | Healthcheck, variables correctas y reintento controlado |
| R02 | Cambio de dependencias | Media | Medio | Versiones definidas y pruebas de build |
| R03 | Datos inválidos | Alta | Alto | Validación servidor y tests de límites |
| R04 | Cobertura aparente sin casos negativos | Media | Alto | Pruebas de rechazo y revisión manual |
| R05 | Merge sin aprobación | Media | Alto | Reglas de protección de main |
| R06 | Credenciales expuestas | Baja | Alto | Secretos, variables de entorno y Git ignore |
| R07 | Escaneo externo sin configurar | Media | Medio | Gates locales autónomos |
| R08 | Métricas de contextos distintos | Media | Medio | Registrar commit y fecha de medición |

## 10. Indicadores y medición

La tasa de aprobación se calcula como pruebas aprobadas entre pruebas ejecutadas, multiplicado por cien. La cobertura se obtiene de Jest y Vitest y se interpreta por cada dimensión. Los defectos y code smells requieren una fuente de análisis identificable, mientras la duplicación se expresa como porcentaje del código inspeccionado. También registro el número de problemas críticos abiertos y el tiempo necesario para corregir una incidencia recurrente.

La comprobación local efectuada sobre el módulo de validación dio 9 pruebas aprobadas de 9, equivalentes al 100 % de esa suite concreta; no representa el porcentaje de cobertura global ni el resultado de todas las suites. Las imágenes de GitHub y del dashboard describen el flujo de referencia y deben leerse como ejemplos de pantalla.

## 11. Gestión de deuda técnica

| Prioridad | Actividad de mejora | Efecto esperado | Criterio de cierre |
|---|---|---|---|
| Alta | Medir cobertura completa con dependencias | Identificar funciones poco probadas | Reportes de ambas capas disponibles |
| Alta | Activar protección real de rama | Evitar integraciones sin checks | Reglas verificables en GitHub |
| Alta | Vincular SonarQube Cloud | Vigilar bugs y duplicación | Análisis vinculado a un commit |
| Media | Ampliar casos de integración MySQL | Detectar errores persistentes | CRUD automático aprobado |
| Media | Registrar dependencias bloqueadas | Reducir variaciones por instalación | Lockfiles versionados |
| Media | Fortalecer gestión de accesos | Mejorar protección de operaciones | Roles, sesiones y pruebas |

## 12. Cierre técnico

Considero que el logro más significativo es disponer de reglas de aceptación explícitas y reproducibles. Las validaciones no dependen de una explicación verbal: están escritas en código y cuentan con pruebas. El siguiente nivel de madurez consistirá en asociar cada ejecución del pipeline y cada indicador de calidad con un cambio verificable del repositorio.
