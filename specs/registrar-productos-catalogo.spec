# Especificación: Registrar nuevos productos en el catálogo

## Historia de usuario

Como administrador, quiero registrar nuevos productos con detalles específicos (SKU, tipo de joya, material, kilataje, peso en gramos, costo y precio de venta) para mantener un control exacto del catálogo.

---

## Campos del formulario de registro

| Campo | Tipo | Obligatorio | Validaciones | Detalle |
|---|---|---|---|---|
| SKU | Texto (auto-generado) | Sí | Único, no editable | Auto-generado con formato: `{TIPO_JOYA}-{MATERIAL}-{CONSECUTIVO}`. Ej: `ANI-ORO-001`, `COL-PLA-002` |
| Tipo de joya | Dropdown (catálogo predefinido) | Sí | Selección obligatoria | Opciones: anillo, collar, pulsera, arete, dije, otros |
| Material | Dropdown (catálogo predefinido) | Sí | Selección obligatoria | Opciones: oro, plata, platino, acero, otros |
| Kilataje | Dropdown (catálogo predefinido) | Condicional | Obligatorio si el material es oro o platino | Ej: 14K, 18K, 24K. Se omite para materiales como plata o acero |
| Peso en gramos | Numérico decimal | Sí | Solo valores positivos, admite decimales | Representa el peso de la pieza |
| Costo | Numérico decimal | Sí | Solo valores positivos, admite decimales | Costo de adquisición o fabricación en soles peruanos (PEN) |
| Precio de venta | Numérico decimal | Sí | Solo valores positivos, admite decimales | Se ingresa manualmente, independientemente del costo. En soles peruanos (PEN) |
| Cantidad/Stock | Numérico entero | Sí | Solo valores enteros positivos | Cantidad de unidades disponibles de este modelo de producto |
| Imágenes | Archivo(s) de imagen | Sí (al menos 1) | Mínimo 1 imagen obligatoria, máximo por definir. Formatos: JPG, PNG, WEBP | Se pueden subir múltiples imágenes; la primera es obligatoria al registrar |
| Artesanal | Checkbox | No | Si se marca, aparece el campo de descripción artesanal | Indica si el producto fue elaborado de forma artesanal |
| Descripción artesanal | Texto largo (textarea) | Condicional | Obligatorio si "artesanal" está marcado | Describe el proceso de elaboración del producto artesanal |

---

## Reglas de negocio

1. **SKU automático**: El SKU se genera automáticamente al seleccionar tipo de joya y material. No es editable por el usuario. El consecutivo se incrementa automáticamente según los productos ya registrados con ese prefijo.
2. **Kilataje condicional**: El campo kilataje solo aparece cuando el material seleccionado es oro o platino. Para otros materiales (plata, acero, etc.) se oculta.
3. **Moneda fija**: Todos los valores monetarios (costo y precio de venta) se expresan únicamente en soles peruanos (PEN). No hay opción de cambiar moneda. Se muestra el símbolo "S/" en los campos correspondientes.
4. **Unicidad de SKU**: No pueden existir dos productos con el mismo SKU. Al ser auto-generado, el sistema garantiza esta unicidad.
5. **Descripción artesanal condicional**: El campo de descripción artesanal solo aparece si el checkbox "artesanal" está marcado. Si no está marcado, el campo se oculta y su valor se ignora.
6. **Imágenes obligatorias**: Al registrar un producto nuevo, es obligatorio subir al menos una imagen. Se pueden agregar más imágenes opcionalmente.
7. **Stock por modelo**: El campo cantidad/stock representa las unidades disponibles de un mismo modelo de producto. No se registran piezas individuales por separado.
8. **Todos los campos obligatorios**: Excepto "artesanal" y "descripción artesanal", todos los demás campos son obligatorios al registrar un producto.

---

## Permisos

- Solo el rol **administrador** puede registrar nuevos productos.
- Otros roles (vendedor, etc.) no tienen acceso a esta funcionalidad.

---

## Moneda

- **Moneda base y única**: Soles peruanos (PEN), símbolo "S/".
- No se contempla conversión a otras monedas ni registro en divisa extranjera.

---

## Flujo de registro

1. El administrador accede al formulario de registro de producto.
2. Selecciona tipo de joya y material. El sistema genera automáticamente el prefijo del SKU y previsualiza el SKU completo.
3. Si el material es oro o platino, aparece el campo kilataje.
4. Completa los campos obligatorios: peso, costo, precio de venta, cantidad/stock.
5. Sube al menos una imagen del producto.
6. Opcionalmente marca "artesanal" y completa la descripción del proceso.
7. Al confirmar, el sistema genera el SKU definitivo con el consecutivo correspondiente y guarda el producto en el catálogo.
8. Se muestra confirmación de registro exitoso con los datos del producto creado.

---

## Asunciones declinadas o refinadas

| # | Asunción original | Decisión final |
|---|---|---|
| 1 | SKU generado manualmente | Auto-generado: `{TIPO_JOYA}-{MATERIAL}-{CONSECUTIVO}` |
| 11 | No se maneja cantidad/stock | Sí hay campo de stock/cantidad disponible |
| 12 | No se incluyen imágenes | Múltiples imágenes, al menos una obligatoria |
| 14 | Moneda local (MXN) | Fija en soles peruanos (PEN) |
| 17 | No hay campo de descripción/notas | Checkbox "artesanal" + texto libre condicional |

---

## Asunciones vigentes

| # | Asunción |
|---|---|
| 2 | No pueden existir dos productos con el mismo SKU |
| 3 | Tipo de joya es un catálogo predefinido (anillo, collar, pulsera, arete, dije, otros) |
| 4 | Material es un catálogo predefinido (oro, plata, platino, acero, otros) |
| 5 | Kilataje aplica solo a metales preciosos (oro, platino) |
| 6 | Peso en gramos acepta decimales y solo valores positivos |
| 7 | Costo = costo de adquisición o fabricación |
| 8 | Precio de venta se ingresa manualmente, no se calcula automáticamente |
| 9 | Todos los campos son obligatorios excepto donde se indique lo contrario |
| 10 | Cada registro es un modelo de producto con stock, no una pieza individual |
| 13 | No se asocia a proveedor en esta historia de usuario |
| 15 | Registro individual, no carga masiva (sin importación CSV) |
| 16 | No hay campo de estado del producto (disponible, vendido, etc.) |
| 18 | Solo el rol administrador puede registrar productos |
| 19 | El registro se realiza desde una interfaz web |
| 20 | No hay campos de descuento o promoción |