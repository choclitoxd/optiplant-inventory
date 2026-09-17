# 🗺️ Hoja de Ruta de Pruebas Funcionales - OptiPlant ERP

Esta guía está diseñada para que evaluadores, QAs o desarrolladores puedan probar el ciclo de vida completo de los datos dentro del sistema OptiPlant de manera estructurada.

## 🟢 Fase 1: Inicialización y Catálogo Base
*El objetivo de esta fase es verificar que la conexión a la base de datos es exitosa y que el catálogo global está disponible.*

1. **Levantar el proyecto**: 
   - Ejecuta `docker compose up --build`.
   - Espera a que los contenedores `optiplant-db`, `nuevachamba-backend` y `nuevachamba-frontend` estén en estado *Running*.
2. **Acceder a la Interfaz**:
   - Abre tu navegador en [http://localhost:3000](http://localhost:3000).
   - Verifica que el **Dashboard** carga y muestra métricas (aunque estén en cero si es la primera vez).
3. **Revisar el Catálogo Global**:
   - Ve a la sección **Catálogo y Stock** en el menú lateral.
   - Selecciona "Global" o una sucursal específica.
   - **Resultado esperado**: Debes ver la lista de productos botánicos pre-cargados (si tienes un script de inicialización) o una tabla vacía lista para operar.

---

## 🟡 Fase 2: Recepción de Inventario (Compras)
*El objetivo es ingresar mercancía al sistema para alimentar las sucursales.*

1. Ve a la sección **Recepción (Compras)**.
2. Selecciona una **Sucursal Destino** (ej. *Sucursal Bogotá - Norte*).
3. Selecciona un **Proveedor**.
4. Agrega uno o más productos a la orden usando los botones **`+`**.
5. Ajusta las cantidades (ej. 50 unidades de Fertilizante, 20 Macetas).
6. Haz clic en **"Procesar Recepción"**.
7. **Verificación**: 
   - Ve a **Catálogo y Stock**, filtra por la sucursal seleccionada.
   - **Resultado esperado**: El inventario de esos productos debió haber aumentado exactamente en las cantidades recibidas.

---

## 🟠 Fase 3: Logística y Transferencias (Movimientos Internos)
*El objetivo es mover stock de una sucursal a otra garantizando la integridad de los datos (transacciones ACID).*

1. Ve a la sección **Logística (Transferencias)**.
2. Selecciona una **Sucursal Origen** (la misma donde acabas de ingresar mercancía).
3. Selecciona una **Sucursal Destino** distinta (ej. *Sucursal Medellín - Poblado*).
4. Agrega productos a transferir.
   - *Intento de error*: Intenta transferir MÁS stock del que tienes disponible en la sucursal origen.
   - **Resultado esperado**: El sistema debe bloquear la acción o el botón de agregar.
5. Transfiere una cantidad válida (ej. 10 unidades).
6. Ejecuta el despacho.
7. **Verificación**:
   - Ve a **Catálogo y Stock**.
   - Revisa la Sucursal Origen: El stock debió disminuir.
   - Revisa la Sucursal Destino: El stock debió aumentar.

---

## 🔴 Fase 4: Punto de Venta y Alertas (Ventas y Stock Mínimo)
*El objetivo es simular una venta a cliente final, descontar inventario y detonar las alertas de Mailtrap.*

1. Ve a la sección **Punto de Venta (POS)**.
2. Selecciona la **Sucursal** desde donde realizarás la venta.
3. Agrega productos al carrito de compras.
   - *Asegúrate de vender una cantidad suficiente para que el stock de la sucursal caiga por debajo de su Umbral Mínimo (Min Stock Threshold, usualmente configurado en 10 o 5).*
4. Haz clic en **"Completar Venta"**.
5. **Verificación de Stock**:
   - Revisa en el **Catálogo** que el stock se haya descontado correctamente tras la venta.
6. **Verificación de Alertas de Sistema**:
   - Ve a la campana de notificaciones (arriba a la derecha) o a la página de **Alertas Stock**.
   - **Resultado esperado**: Debe aparecer una alerta en estado `CRITICAL` o `WARNING` indicando que el producto XYZ está por debajo del nivel mínimo.
7. **Verificación de Correo (Mailtrap)**:
   - En la página de Alertas, haz clic en **"Notificar a Gerencia"**.
   - Ingresa un correo y envía.
   - Revisa la consola de Docker (`docker logs optiplant-backend`) para confirmar que el hilo asíncrono `@Async` procesó el correo con Mailtrap. (Nota: Recuerda usar el correo registrado en Mailtrap).

---

## 🔵 Fase 5: Análisis y Dashboard (Validación de KPIs)
*El objetivo es asegurar que las transacciones anteriores alimentaron correctamente los indicadores del negocio.*

1. Vuelve al **Dashboard** (Página principal).
2. **Resultados esperados**:
   - **Total de Productos en Stock**: Debe reflejar la suma global real.
   - **Valor Total del Inventario**: Debe haberse recalculado basado en (`Precio Base * Stock`).
   - **Sucursales Activas**: Debe mostrar la cantidad de sucursales con al menos 1 unidad de inventario.
   - **Gráficos**: El valor por sucursal debió haber cambiado tras las ventas, compras y transferencias realizadas en los pasos previos.

---

## 🛠️ Fase Opcional (Modo Dev): Pruebas Automatizadas
Si deseas validar la integridad del código sin interfaz gráfica, puedes correr los tests:
- **Backend**: `mvn test` (o entrar al contenedor backend y ejecutarlo).
- **Frontend**: `npx vitest run --environment jsdom`.
