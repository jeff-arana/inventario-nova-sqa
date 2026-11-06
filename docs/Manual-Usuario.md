# Manual de usuario de Inventario Nova

## Inicio y navegación

Inventario Nova presenta una pantalla principal de inventario con indicadores generales y una tabla de productos. El panel central permite consultar artículos, revisar su existencia y localizar rápidamente registros mediante búsqueda. En los datos iniciales del sistema hay doce productos distribuidos por categorías de informática y tecnología.

![FIG:01_inventario_en_navegador.png]

## Registrar un producto

Desde el botón de nuevo producto se abre un formulario. Escribo el SKU, el nombre comercial, la categoría, el precio en quetzales y la cantidad en existencia. Conviene establecer un SKU claro y diferente al de los demás artículos. Antes de guardar verifico que el precio no sea negativo, que la existencia sea un entero mayor o igual que cero y que los campos de identificación estén completos. Cuando todo es correcto, confirmo la operación y reviso que el nuevo registro aparezca en la tabla.

## Consultar y buscar

Puedo desplazarme por el catálogo o introducir un término en el buscador. La búsqueda admite coincidencias en nombre, categoría o SKU. Si necesito revisar la cantidad de un producto específico, utilizo el nombre o parte de su código. Los estados de inventario ayudan a identificar registros agotados o próximos a necesitar reposición.

## Modificar un producto

Para cambiar la información selecciono Editar en la fila correspondiente. La pantalla presenta los datos actuales; modifico solamente los campos necesarios y guardo. Es recomendable comprobar posteriormente la tabla, ya que la edición puede afectar el valor total del inventario y el estado de disponibilidad.

![FIG:03_edicion_real_de_producto.png]

## Eliminar un registro

Cuando un artículo ya no debe mantenerse en el catálogo utilizo la acción Eliminar. Verifico que el registro seleccionado sea el correcto y confirmo la operación de acuerdo con la interfaz. Después compruebo que el producto no aparezca en el listado. En un escenario comercial con movimientos históricos sería preferible implementar inactivación lógica; esta versión utiliza un CRUD directo.

## Mensajes habituales

| Situación | Significado | Qué hacer |
|---|---|---|
| SKU ya existe | Otro producto usa el mismo código | Asignar SKU diferente |
| Precio inválido | El importe no cumple el rango | Escribir número no negativo |
| Existencia inválida | Se requiere un entero válido | Corregir unidades |
| Producto no encontrado | ID no existe o fue eliminado | Actualizar la consulta |
| Error de conexión | API o BD no disponible | Verificar servicios locales |

## Uso cuidadoso de la información

Antes de registrar o modificar un artículo verifico los datos del producto. Esta revisión humana complementa las comprobaciones automáticas. Para no alterar los casos de prueba es recomendable utilizar códigos distintos a los datos iniciales y evitar eliminar los productos de muestra cuando se estén revisando las capturas del catálogo.
