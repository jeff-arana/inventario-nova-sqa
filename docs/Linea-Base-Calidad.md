# Diagnóstico inicial y línea base de calidad

## Contexto de la evaluación

La línea base sirve para reconocer qué controles existen antes de incorporar un mecanismo de aseguramiento. En Inventario Nova dispongo de una referencia arquitectónica CRUD y de un archivo local `baseline/legacyValidation.js` que representa una validación insuficiente: comprobar valores por su condición de verdadero o falso no distingue correctamente entre cero permitido, número negativo y tipo inadecuado. El archivo es didáctico, no representa un commit histórico certificado del proyecto público.

No se dispone de un escaneo real del código de origen en SonarQube Cloud. Por eso presento por separado el estado documentado del ejemplo de validación, la instrumentación incorporada y los indicadores de un escenario de referencia que permite interpretar los gráficos sin atribuirlos a resultados observados.

## Diagnóstico de riesgos iniciales

| Observación | Consecuencia potencial | Respuesta incorporada |
|---|---|---|
| Validación basada en `!!precio` o `!!stock` | Rechazo de cero o aceptación incorrecta de ciertos valores | Comprobaciones numéricas explícitas |
| SKU sin regla uniforme | Confusión entre identificadores y registros | Normalización y regla de formato |
| Lógica mezclada con consultas | Dificulta probar sin BD | Servicio de persistencia separado |
| Cambios sin puerta automatizada | Errores pasan inadvertidos | Etapas CI/CD y condiciones de rechazo |
| Ausencia de matriz por riesgo | Casos límite sin seguimiento | IDs de pruebas y criterio de aceptación |
| Falta de indicadores reproducibles | Comparaciones subjetivas | Reportes por dimensión, almacenados por versión |

## Estado inicial conocido y estado final verificable

| Dimensión | Referencia inicial disponible | Estado técnico de esta implementación |
|---|---|---|
| Pruebas del archivo didáctico baseline | No incluye tests propios | 9 pruebas locales verificadas |
| Capas | Esquema CRUD de referencia | React, Express y MySQL separados |
| Umbral configurado | Sin control en el ejemplo baseline | 60 % por dimensión y por capa |
| Análisis estático | Sin configuración en baseline didáctico | ESLint y comprobación de sintaxis |
| Pipeline | No incluido en baseline didáctico | 4 etapas descritas en YAML |
| SonarCloud | Sin medición verificable | Configuración disponible, sin ejecución acreditada |
| Protección de main | Sin reglas verificables en el material local | Configuración prevista; requiere activación en GitHub |

## Medición reproducible de comprobaciones locales

Para validar el módulo de reglas de negocio se ejecutó `npm run test:core` en Node 22.16.0: nueve casos se ejecutaron y los nueve aprobaron, sin fallos ni omisiones. `npm run check --prefix backend` comprobó la sintaxis de `app.js`, `services.js`, `validation.js`, `db.js` y `server.js` y terminó correctamente.

![FIG:07_ejecucion_9_pruebas_node.png]

## Indicadores verificados y valores pendientes

| Métrica | Antes | Comprobación actual | Interpretación |
|---|---|---|---|
| Pruebas del módulo de validación | Sin registro inicial comparable | 9 de 9 aprobadas | Resultado local real, limitado a esa suite |
| Sintaxis de backend | Sin registro anterior comparable | 5 archivos revisados sin fallos | Verificación estructural reproducible |
| Cobertura Jest/Vitest | No medida | No medida | Requiere ejecución de las suites completas |
| Bugs y code smells en Sonar | No medidos | No medidos | Requiere escaneo conectado a un commit |
| Duplicación de código | No medida | No medida | Requiere análisis estático externo |

No calculo variaciones porcentuales sin dos mediciones obtenidas por el mismo procedimiento. Los controles presentes constituyen una mejora verificable de la instrumentación, no un resultado inventado del dashboard.

## Valor del diagnóstico

La línea base permite explicar por qué una práctica de SQA necesita una fotografía inicial. Una mejora creíble no se determina por la estética de una captura, sino por la repetición del mismo método de medición sobre dos versiones comparables. En esta etapa, la evidencia local permite afirmar el funcionamiento de las nueve pruebas de validación y la disponibilidad de controles configurados, no un porcentaje global histórico de mejora.
