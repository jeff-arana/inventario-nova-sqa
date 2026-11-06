# Registro analítico de riesgos y deuda técnica

## Priorización de problemas

Ordené las mejoras según la probabilidad de producir un resultado incorrecto y el impacto sobre la operación del inventario. Un fallo que permita registrar un precio negativo o repetir un SKU es más importante que una modificación estética de la tabla. La prioridad también depende de si el defecto puede detectarse mediante un test automatizado o requiere revisión humana.

| ID | Riesgo o deuda | Severidad | Medida de mitigación | Criterio de cierre |
|---|---|---|---|---|
| DT-01 | Cobertura total todavía no ejecutada | Alta | Ejecutar Jest y Vitest con dependencias | Dos `coverage-summary.json` válidos |
| DT-02 | Reglas de protección no activadas en GitHub | Alta | Exigir checks y revisión de PR | PR bloqueado ante fallo |
| DT-03 | Sonar sin análisis remoto | Alta | Configurar token y proyecto | Dashboard con commit verificable |
| DT-04 | Sin autenticación en API | Alta | Diseñar sesiones y permisos | Rutas protegidas y tests de autorización |
| DT-05 | Riesgo de SKU duplicado | Media | Restricción UNIQUE y caso de conflicto | API responde 409 bajo prueba |
| DT-06 | Pérdida de datos al borrar definitivamente | Media | Considerar estado «inactivo» | Historial conservado y probado |
| DT-07 | Dependencias sin lockfiles en versión inicial | Media | Versionar lockfiles generados | Instalación reproducible en CI |
| DT-08 | Mediciones sin versión asociada | Media | Guardar hash y fecha en reporte | Historial comparable por commit |
| DT-09 | Diferencia entre vista local y stack MySQL | Media | Repetir la demostración en contenedores | Captura con stack completo |

## Prácticas de mantenimiento

Cuando detecto un defecto comienzo con un caso reproducible que muestre su origen. Después creo una prueba que falle por ese comportamiento, aplico la corrección y ejecuto las suites relacionadas. Finalmente reviso el informe de cobertura y las alertas estáticas, adjunto los resultados al cambio y solicito revisión antes de integrarlo. Este procedimiento evita corregir síntomas sin proteger el comportamiento esperado.

## Valor de la trazabilidad

La matriz permite comprobar qué pruebas protegen cada regla. Por ejemplo, RN-02 se relaciona con una existencia fraccionaria y con una prueba Node que rechaza dicha entrada. En cambio, RF-05 dispone de una ruta API y casos declarados, pero la sesión gráfica registrada no incluye una eliminación; el estado de esa evidencia permanece identificado sin inventar una operación que no se realizó.
