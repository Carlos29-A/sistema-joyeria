# Especificación: Agrupar productos por categorías y marcas

## Historia de usuario

Como administrador, quiero agrupar los productos por categorías (Anillos, Collares, Pulseras, Relojes) y marcas, para facilitar la organización del catálogo y la búsqueda de productos por parte de los usuarios.

---

## Campos del formulario de categoría

| Campo | Tipo | Obligatorio | Validaciones | Detalle |
|---|---|---|---|---|
| Nombre | Texto | Sí | Único, mínimo 2 caracteres, máximo 100 caracteres | Nombre de la categoría (ej: Anillos, Collares, Pulseras, Relojes) |

## Campos del formulario de marca

| Campo | Tipo | Obligatorio | Validaciones | Detalle |
|---|---|---|---|---|
| Nombre | Texto | Sí | Único, mínimo 2 caracteres, máximo 100 caracteres | Nombre de la marca (ej: Cartier, Tiffany & Co., Pandora) |

## Campos adicionales en el formulario de producto

| Campo | Tipo | Obligatorio | Validaciones | Detalle |
|---|---|---|---|---|
| Categoría | Dropdown (catálogo predefinido) | Sí | Selección obligatoria | Categoría a la que pertenece el producto |
| Marca | Dropdown (catálogo predefinido) | No | Selección opcional | Marca del producto. Puede quedar vacío para piezas artesanales o genéricas |

---

## Reglas de negocio

1. **Categoría es un concepto nuevo e independiente** — Las categorías (Anillos, Collares, Pulseras, Relojes) son diferentes de los tipos de joya ya existentes. Una categoría agrupa múltiples tipos de joya.
2. **Relojes es una categoría nueva** — Se agrega "Relojes" como categoría que no existía en los tipos de joya originales.
3. **Categorías predefinidas** — Las categorías son un listado predefinido por el sistema. Solo el administrador puede crear, editar y eliminar categorías.
4. **Marcas predefinidas** — Las marcas son un listado predefinido por el sistema. Solo el administrador puede crear, editar y eliminar marcas.
5. **Una categoría por producto** — Cada producto pertenece a una sola categoría. No se permiten múltiples categorías por producto.
6. **Una marca por producto** — Cada producto tiene una sola marca. No se permiten múltiples marcas por producto.
7. **Marca opcional** — La marca es un campo opcional en el registro de producto. Las piezas artesanales o genéricas pueden no tener marca.
8. **Categoría obligatoria** — La categoría es un campo obligatorio en el registro de producto.
9. **Categoría agrupa tipos de joya** — Una categoría puede contener múltiples tipos de joya (ej: "Anillos" incluye anillos de oro, plata, etc.). No hay relación restrictiva entre categoría y tipo de joya.
10. **Filtros independientes** — Categorías y marcas son filtros independientes en el catálogo. Se pueden combinar con los filtros ya existentes de tipo de joya y material.
11. **Marcas sin precio ni moneda** — Las marcas no tienen precio ni moneda asociada, son simplemente un nombre identificador.
12. **Sin imágenes para categorías/marcas** — Las categorías y marcas no tienen imágenes ni iconos asociados.
13. **Solo administrador gestiona** — Solo el administrador puede crear, editar y eliminar categorías y marcas.
14. **Formato de SKU sin cambios** — El formato de SKU generado automáticamente (`{TIPO_JOYA}-{MATERIAL}-{CONSECUTIVO}`) no se modifica con la adición de categorías y marcas.
15. **CRUD completo** — Se necesita un módulo de administración para crear, listar, editar y eliminar tanto categorías como marcas desde una interfaz separada del registro de productos.
16. **No eliminación en cascada** — No se puede eliminar una categoría o marca si tiene productos asociados. Se debe reasignar los productos a otra categoría/marca o desactivar la categoría/marca primero.
17. **Sin campos de descripción** — Categorías y marcas solo tienen nombre. No tienen descripción ni campos adicionales.
18. **Dropdowns en formulario de producto** — Al registrar un producto, las categorías y marcas se muestran como dropdowns con las opciones disponibles.
19. **Filtros en catálogo** — El catálogo de productos incluye filtros por categoría y marca además de los ya existentes (tipo de joya y material).
20. **Visibles en ficha de producto** — La ficha de detalle del producto muestra la categoría y marca del producto.

---

## Permisos

- Solo el rol **administrador** puede crear, editar y eliminar categorías y marcas.
- Solo el rol **administrador** puede asignar categorías y marcas a productos.
- Los roles de solo lectura (vendedor, etc.) pueden ver y filtrar por categorías y marcas en el catálogo.

---

## Categorías predefinidas (iniciales)

| Categoría |
|---|
| Anillos |
| Collares |
| Pulseras |
| Relojes |

## Marcas (ejemplos, se agregan dinámicamente)

Las marcas se agregan dinámicamente por el administrador según necesidad. No hay marcas iniciales predefinidas en el sistema.

---

## Flujo de gestión de categorías y marcas

1. El administrador accede al módulo de administración de categorías/marcas.
2. Puede crear una nueva categoría o marca ingresando el nombre.
3. Puede editar el nombre de una categoría o marca existente.
4. Puede eliminar una categoría o marca solo si no tiene productos asociados.
5. El sistema muestra un mensaje de error si intenta eliminar una categoría o marca con productos asociados.

## Flujo de registro de producto (actualizado)

1. El administrador accede al formulario de registro de producto.
2. Selecciona tipo de joya y material. El sistema genera automáticamente el prefijo del SKU.
3. **Selecciona la categoría** (obligatorio) del dropdown.
4. Si el material es oro o platino, aparece el campo kilataje.
5. Completa los campos obligatorios: peso, costo, precio de venta, cantidad/stock.
6. **Selecciona la marca** (opcional) del dropdown, o la deja vacía si no aplica.
7. Sube al menos una imagen del producto.
8. Opcionalmente marca "artesanal" y completa la descripción del proceso.
9. Al confirmar, el sistema genera el SKU definitivo y guarda el producto en el catálogo.
10. Se muestra confirmación de registro exitoso.

## Flujo de filtrado en catálogo (actualizado)

1. El usuario accede al catálogo de productos.
2. Puede filtrar por: tipo de joya, material, **categoría** y **marca** (además de los filtros ya existentes).
3. Los filtros son independientes y se combinan entre sí.
4. Los resultados se actualizan dinámicamente al seleccionar filtros.

---

## Asunciones vigentes

| # | Asunción |
|---|---|
| 1 | Categoría es un concepto nuevo e independiente del tipo de joya |
| 2 | Relojes se agrega como categoría nueva |
| 3 | Categorías predefinidas por el sistema, gestionadas por administrador |
| 4 | Marcas predefinidas por el sistema, gestionadas por administrador |
| 5 | Una categoría por producto (no múltiples) |
| 6 | Una marca por producto (no múltiples) |
| 7 | Marca es opcional en el registro de producto |
| 8 | Categoría es obligatoria en el registro de producto |
| 9 | Una categoría agrupa múltiples tipos de joya |
| 10 | Categorías y marcas son filtros independientes en el catálogo |
| 11 | Marcas sin precio ni moneda asociada |
| 12 | Categorías y marcas sin imágenes ni iconos |
| 13 | Solo el administrador gestiona categorías y marcas |
| 14 | Formato de SKU no cambia con la adición de categorías y marcas |
| 15 | CRUD completo para categorías y marcas en módulo separado |
| 16 | No eliminación en cascada si hay productos asociados |
| 17 | Categorías y marcas solo tienen nombre, sin descripción |
| 18 | Dropdowns en formulario de producto para categoría y marca |
| 19 | Filtros por categoría y marca en el catálogo |
| 20 | Categoría y marca visibles en la ficha de producto |