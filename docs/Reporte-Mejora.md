# Análisis de mejoras y resultados de calidad

## Síntesis técnica

La intervención sobre Inventario Nova organiza las reglas del producto, formaliza las rutas de API, incorpora suites automatizadas y define un flujo CI/CD con condiciones objetivas. La finalidad es disminuir la dependencia de comprobaciones manuales y convertir la calidad en una parte repetible del mantenimiento.

## Cambios concretos del código

| Área | Diseño aplicado | Mejora que persigo |
|---|---|---|
| Validador | Reglas para SKU, nombre, precio y stock | Impedir entradas incoherentes |
| Servicio de productos | Consultas parametrizadas | Separar SQL de HTTP y mitigar entradas peligrosas |
| API Express | Respuestas 200/201/204/400/404/409/422/500 | Consistencia en el contrato HTTP |
| MySQL | Clave única para SKU, tipos adecuados y marcas de tiempo | Integridad de registros |
| Frontend React | Formulario, tabla, estados de inventario | Flujo claro de consulta y edición |
| Pruebas | Node/Jest/Vitest/Supertest | Regresión automática y casos negativos |
| CI | Jobs build, test, analyze, report | Verificaciones visibles en cada cambio |
| Configuración de Sonar | Archivo de propiedades y ejecución condicional | Análisis complementario cuando exista conexión |

## Comprobaciones ejecutadas

| Comprobación | Procedimiento | Evidencia | Resultado |
|---|---|---|---|
| Validación de reglas | `npm run test:core` | Terminal + TXT | 9/9 aprobadas |
| Sintaxis de backend | `npm run check --prefix backend` | Terminal + TXT | Código de salida 0 |
| Verificación de archivo CI | Inspección de `.github/workflows/ci.yml` | YAML en repositorio | Cuatro jobs definidos |
| Umbrales de Jest/Vitest | Inspección de configuraciones | Archivos de prueba | 60 % definido |
| SonarQube Cloud | Integración condicional | `sonar-project.properties` | Requiere análisis de plataforma |

![FIG:09_workflow_ci_configurado.png]

## Comparación de indicadores con procedencia identificable

| Indicador | Diagnóstico inicial | Situación documentada | Lectura técnica |
|---|---|---|---|
| Pruebas reproducibles de validación | Sin ejecución histórica certificada | 9 pruebas aprobadas | Se dispone de una suite local verificable |
| Revisión de sintaxis | Sin registro histórico | 5 archivos sin error | Validación de sintaxis disponible |
| Pipeline de cuatro etapas | Ausente en el ejemplo didáctico | YAML con build, test, analyze y report | Configuración incorporada; ejecución remota no registrada |
| Cobertura global | Sin cifra inicial | Sin cifra medida | Umbral de 60 % listo para validarse |
| Bugs, smells y duplicación | Sin escaneo inicial | Sin escaneo final | No cabe calcular variaciones numéricas |

La diferencia está en la presencia de controles reproducibles, no en porcentajes que todavía no se han obtenido del mismo conjunto de herramientas.

## Comportamiento del quality gate

En el diseño, `build` revisa sintaxis y construye el cliente. `test` inicia MySQL y ejecuta las suites con informes. `analyze` aplica ESLint y lee los JSON de cobertura. `report` registra resultados y devuelve estado fallido si alguno de los jobs previos no fue exitoso. Este encadenamiento evita que una verificación negativa se ignore silenciosamente.

![FIG:09_workflow_ci_configurado.png]

![FIG:09_workflow_ci_configurado.png]

## Análisis crítico

El pipeline no sustituye la revisión funcional ni el criterio del desarrollador. Una suite puede aprobar con pruebas poco representativas; por eso incluí límites, errores y regresión, no solamente el camino normal. La cobertura debe evaluarse por líneas, funciones, sentencias y ramas. Un porcentaje superior al mínimo facilita la confianza, pero no garantiza por sí solo que todas las reglas estén correctamente especificadas.

También separé las métricas que pueden reproducirse aquí de las que necesitan una ejecución remota. Esta distinción evita comparar capturas de distinto origen o asumir que una herramienta instalada produjo un resultado. El reporte definitivo de dos versiones requerirá registrar hash, fecha, salida del pipeline y medidas comparables.

## Prioridades de mejora

Mi siguiente prioridad sería ejecutar todas las suites con dependencias y MySQL disponibles; después activar la protección de main, vincular Sonar y crear un historial de mediciones. Una vez reunidos esos datos, revisaría las funciones sin cobertura, corregiría defectos detectados y documentaría nuevamente la evolución de la calidad.
