# 📋 Tablero Kanban: Sistema de Inventario Multi-Sucursal

## 🗄️ TODO (Por hacer / Backlog)



### 📝 Tarjeta 4: Módulo de Compras (Costo Promedio Ponderado)
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Calcular el costo promedio ponderado en el backend al momento de registrar la compra garantiza que la lógica financiera no dependa de manipulaciones del cliente (seguridad y consistencia).
**Checklist Técnica:**
- [ ] **PostgreSQL:** Crear tabla `purchase` y `purchase_detail`.
- [ ] **Spring Boot:** Crear endpoint `POST /api/purchases`.
- [ ] **Spring Boot:** Implementar lógica transaccional (`@Transactional`) que:
  - Inserte el registro de la compra.
  - Recalcule el costo promedio ponderado del producto.
  - Aumente el `stock` en la tabla `inventory` de la sucursal receptora.
- [ ] **React (TS):** Crear formulario maestro-detalle para registrar facturas de proveedores.

### 📝 Tarjeta 5: Módulo de Ventas (Validación de Stock)
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** La validación de stock *debe* ser concurrente en el motor de BD (usando `SELECT ... FOR UPDATE`) para evitar saldos negativos si dos cajeros venden el último artículo al mismo tiempo.
**Checklist Técnica:**
- [ ] **PostgreSQL:** Crear tablas `sale` y `sale_detail`.
- [ ] **Spring Boot:** Crear endpoint `POST /api/sales`.
- [ ] **Spring Boot:** Implementar validación estricta de saldo. Si `cantidad_venta > stock_actual`, lanzar excepción (`HTTP 400`).
- [ ] **Spring Boot:** Aplicar bloqueo pesimista/optimista en la fila del inventario al descontar.
- [ ] **React (TS):** Interfaz de Punto de Venta (POS). Deshabilitar el botón de venta si el stock local pre-consultado es 0 (UX).

### 📝 Tarjeta 6: Módulo de Transferencias entre Sucursales
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Usar un flujo de dos fases (Envío -> Tránsito -> Recepción) es la única forma auditable de manejar pérdidas durante el transporte y hacer recepciones parciales.
**Checklist Técnica:**
- [ ] **PostgreSQL:** Crear tabla `transfer` (estados: PENDING, SHIPPED, COMPLETED, PARTIAL) y `transfer_detail`.
- [ ] **Spring Boot:** Endpoint `POST /api/transfers/ship` -> Descuenta stock en sucursal origen.
- [ ] **Spring Boot:** Endpoint `POST /api/transfers/receive` -> Lógica para recepción.
- [ ] **Spring Boot:** Lógica de recepción parcial: Si la cantidad recibida es menor a la enviada, calcular faltante y registrar en tabla de `inventory_adjustment` (Merma).
- [ ] **React (TS):** Panel de "Transferencias Entrantes" y modal para confirmar cuántas unidades llegaron realmente.

### 📝 Tarjeta 7: Dashboard de Análisis
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Un panel visual consolida el valor del sistema para la gerencia. Se delega la carga analítica al backend (agrupaciones SQL) para no saturar la memoria del navegador.
**Checklist Técnica:**
- [ ] **Spring Boot:** Crear queries y endpoints de agregación (ej. total de ventas diarias, productos con bajo stock).
- [ ] **React (TS):** Integrar biblioteca de gráficos (ej. Recharts o Chart.js).
- [ ] **React (TS):** Construir vista principal (Landing) con indicadores clave de rendimiento (KPIs).

### 📝 Tarjeta 8: Alertas Inteligentes de Stock
**Etiqueta:** `[SPRINKLES]`
**¿Por qué se hizo así?** Aporta proactividad al sistema. Usar tareas programadas en el servidor evita que dependa de que un usuario tenga abierta la aplicación.
**Checklist Técnica:**
- [ ] **PostgreSQL:** Añadir campo `min_stock_threshold` a la tabla `inventory`.
- [ ] **Spring Boot:** Configurar `@EnableScheduling`.
- [ ] **Spring Boot:** Crear un cron job (`@Scheduled`) que evalúe diariamente el inventario.
- [ ] **React (TS) / Backend:** Enviar notificación por WebSocket o mostrar un banner de alerta en el Dashboard si un producto cae por debajo de su umbral.

### 📝 Tarjeta 9: Documentación y Evidencia de IA
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** La transparencia en el uso de herramientas de IA durante el desarrollo es vital para justificar decisiones arquitectónicas y evaluar el prompt engineering.
**Checklist Técnica:**
- [ ] Recopilar logs/transcripciones del asistente.
- [ ] Redactar documento Markdown con casos de uso de IA (ej. generación de queries, configuración de Docker).
- [ ] Revisión final del código generado para asegurar cumplimiento de estándares de calidad.

---

## 🏗️ DOING (En proceso / Sprint Actual)




---

## ✅ DONE (Hecho)

### 📝 Tarjeta 1: Diseño de Ingeniería y Modelado
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Definir el modelo de datos y la arquitectura antes de escribir código previene refactorizaciones costosas y asegura el alineamiento de las 3 capas.
**Checklist Técnica:**
- [x] **Diagrama E-R:** Modelar normalización relacional (Productos, Sucursales, Inventario, Transferencias).
- [x] **Diagrama de Casos de Uso:** Mapear actores (Cajero, Gerente, Bodeguero).
- [x] **Diagrama de Actividades:** Flujo específico de la recepción parcial de una transferencia.
### 📝 Tarjeta 2: Infraestructura y Docker Compose Base
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Iniciar con Docker garantiza el principio de "funciona en mi máquina = funciona en producción" y cumple el requisito del comando único de despliegue.
**Checklist Técnica:**
- [x] **General:** Crear archivo `docker-compose.yml` en la raíz del proyecto.
- [x] **PostgreSQL:** Configurar servicio `db` usando imagen oficial de Postgres (Alpine), montar volúmenes persistentes y scripts de `init.sql`.
- [x] **Spring Boot:** Crear `Dockerfile` usando Gradle/Maven multi-stage build.
- [x] **React (TS):** Crear `Dockerfile` utilizando Vite/CRA y servir estáticos con Nginx.
- [x] **General:** Probar comando `docker compose up --build` y asegurar conectividad entre contenedores a través de una red bridge interna.

### 📝 Tarjeta 3: Módulo de Catálogo y Sucursales
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Separar el "Catálogo Global" de los "Inventarios por Sucursal" evita la duplicación de datos (normalización) y permite escalar si se abren nuevas tiendas.
**Checklist Técnica:**
- [x] **PostgreSQL:** Crear tablas `product`, `branch`, e `inventory` (tabla pivote con `branch_id`, `product_id`, `stock`).
- [x] **Spring Boot:** Crear entidades JPA, repositorios e interfaces de servicio.
- [x] **Spring Boot:** Exponer endpoints REST CRUD (`GET`, `POST`, `PUT`) para Productos y Sucursales.
- [x] **React (TS):** Crear interfaces/tipos TypeScript (`Product`, `Branch`).
- [x] **React (TS):** Desarrollar vistas (Tablas y Formularios) para dar de alta productos y sucursales, consumiendo la API.

---

## 🐛 BUGS / DUDAS (Bloqueos)
*(Vacío al inicio del proyecto, aquí moveremos las tarjetas si encontramos incompatibilidades de versiones de Spring Boot / React o dudas en la lógica de negocio)*
