# Registro de capturas de Inventario Nova

## Procedencia

Las capturas de `capturas/` fueron obtenidas del navegador Chromium durante una sesión local con funciones reales de búsqueda, edición, creación y consulta HTTP. Se utilizó una **vista local ejecutable** basada en la hoja de estilo del proyecto y en los productos cargados desde `database/init.sql`. Para esta sesión, la persistencia fue realizada por un servidor Python con SQLite, incluido en `herramientas/visualizacion_local`. **No son capturas de la ejecución completa de Express + MySQL** ni de un servicio desplegado en internet.

Las pruebas incluidas en `07_ejecucion_9_pruebas_node.png` fueron ejecutadas sobre el módulo real `backend/tests/validation.node.test.mjs` con Node.js; las nueve pruebas aprobaron. La imagen `08_revision_sintaxis_backend.png` muestra la salida registrada del comando de comprobación de sintaxis. La captura `09_workflow_ci_configurado.png` reproduce el contenido del archivo real `.github/workflows/ci.yml` mediante un visor local. **No demuestra que GitHub Actions se haya ejecutado.**

El panel de SonarQube Cloud, el estado del pull request y la protección de `main` solo se pueden documentar una vez publicados y ejecutados en cuentas reales. Las métricas remotas no se presentan como verificadas.

## Índice de imágenes

| Archivo | Contenido realmente mostrado |
|---|---|
| `01_inventario_en_navegador.png` | Catálogo con 12 productos desde la base local |
| `02_busqueda_producto_funcionando.png` | Filtro por «Kingston» aplicado en el navegador |
| `03_edicion_real_de_producto.png` | Formulario con campos precargados |
| `04_actualizacion_guardada.png` | Cambio de existencias después de guardar |
| `05_registro_agregado_real.png` | Producto nuevo incorporado al catálogo |
| `06_api_productos_respuesta_real.png` | Respuesta JSON del servicio HTTP local |
| `07_ejecucion_9_pruebas_node.png` | Resultado de Node test ejecutado: 9/9 |
| `08_revision_sintaxis_backend.png` | Revisión de sintaxis ejecutada, código 0 |
| `09_workflow_ci_configurado.png` | Texto del workflow local, sin ejecución de GitHub |

### Reproducción

Ejecutar `python herramientas/visualizacion_local/servidor_local.py` y abrir `http://127.0.0.1:8765`. Los registros automáticos reales se reproducen con `npm run test:core` y `npm run check --prefix backend` en la raíz del proyecto.
