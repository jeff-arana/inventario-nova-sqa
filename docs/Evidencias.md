# Evidencias visuales y relación con el código

## Aplicación

La pantalla del inventario presenta el catálogo precargado y la navegación de productos. El formulario refleja la operación de edición, mientras el registro de consola contiene resultados obtenidos al ejecutar la suite local de validación.

![FIG:01_inventario_en_navegador.png]

![FIG:03_edicion_real_de_producto.png]

![FIG:07_ejecucion_9_pruebas_node.png]

## Integración continua

El archivo `.github/workflows/ci.yml` contiene las cuatro etapas de verificación. Las imágenes de estado aprobado y rechazado sirven como ejemplos de la interfaz que se utiliza al interpretar checks. No están asociadas a IDs de ejecución remota de GitHub.

![FIG:09_workflow_ci_configurado.png]

![FIG:09_workflow_ci_configurado.png]

![FIG:09_workflow_ci_configurado.png]

## Dashboard y rama principal

La vista de métricas contiene un escenario de referencia para explicar cobertura, bugs, code smells y duplicación. La pantalla de protección muestra los controles que deberían activarse antes de un merge. No son mediciones ni ajustes ya confirmados en una cuenta externa.



## Consola de comprobación de sintaxis

![FIG:08_revision_sintaxis_backend.png]

## Trazabilidad

| Evidencia | Origen | Lectura correcta |
|---|---|---|
| 01 y 02 | Vistas de referencia del sistema | Diseño visual y uso del CRUD |
| 03 y 04 | Escenarios de interfaz de GitHub Actions | Aprobación/rechazo de quality gates |
| 05 | Dashboard con indicadores de referencia | Interpretación de métricas |
| 06 | Configuración de rama de referencia | Política de revisión |
| 07 | Salida local de `npm run test:core` | Nueve casos aprobados |
| 08 | Salida local de `npm run check` | Sintaxis correcta |
| 09 | Diagrama extraído de la estructura CI | Cuatro etapas y criterio de cobertura |

La evidencia local se conserva también como texto plano en `evidencias_verificables/`, por lo que puede volver a comprobarse ejecutando los mismos comandos.
