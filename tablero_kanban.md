# 📋 Tablero Kanban: Sistema de Inventario Multi-Sucursal

## 🗄️ TODO (Por hacer / Backlog)







### 📝 Tarjeta 6: Módulo de Transferencias entre Sucursales
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Usar un flujo de dos fases (Envío -> Tránsito -> Recepción) es la única forma auditable de manejar pérdidas durante el transporte y hacer recepciones parciales.
**Checklist Técnica:**
- [x] **PostgreSQL:** Crear tabla `transfer` (estados: PENDING, SHIPPED, COMPLETED, PARTIAL) y `transfer_detail`.
- [x] **Spring Boot:** Endpoint `POST /api/transfers/ship` -> Descuenta stock en sucursal origen.
- [x] **Spring Boot:** Endpoint `POST /api/transfers/receive` -> Lógica para recepción.
- [x] **Spring Boot:** Lógica de recepción parcial: Si la cantidad recibida es menor a la enviada, calcular faltante y registrar en tabla de `inventory_adjustment` (Merma).
- [ ] **React (TS):** Panel de "Transferencias Entrantes" y modal para confirmar cuántas unidades llegaron realmente.

### 📝 Tarjeta 7: Dashboard de Análisis
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Un panel visual consolida el valor del sistema para la gerencia. Se delega la carga analítica al backend (agrupaciones SQL) para no saturar la memoria del navegador.
**Checklist Técnica:**
- [x] **Spring Boot:** Crear queries y endpoints de agregación (ej. total de ventas diarias, productos con bajo stock).
- [ ] **React (TS):** Integrar biblioteca de gráficos (ej. Recharts o Chart.js).
- [ ] **React (TS):** Construir vista principal (Landing) con indicadores clave de rendimiento (KPIs).

### 📝 Tarjeta 8: Alertas Inteligentes de Stock
**Etiqueta:** `[SPRINKLES]`
**¿Por qué se hizo así?** Aporta proactividad al sistema. Usar tareas programadas en el servidor evita que dependa de que un usuario tenga abierta la aplicación.
**Checklist Técnica:**
- [x] **PostgreSQL:** Añadir campo `min_stock_threshold` a la tabla `inventory`.
- [x] **Spring Boot:** Configurar `@EnableScheduling`.
- [x] **Spring Boot:** Crear un cron job (`@Scheduled`) que evalúe diariamente el inventario.
- [x] **React (TS):** `AlertsPage.tsx` — panel de alertas con opción de envío de email al gerente.

### 📝 Tarjeta 7: Dashboard de Análisis
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Un panel visual consolida el valor del sistema para la gerencia. Se delega la carga analítica al backend (agrupaciones SQL) para no saturar la memoria del navegador.
**Checklist Técnica:**
- [x] **Spring Boot:** Crear queries y endpoints de agregación (ej. total de ventas diarias, productos con bajo stock).
- [x] **React (TS):** Integrar biblioteca de gráficos (`BranchValueChart` con Recharts/Chart.js).
- [x] **React (TS):** `DashboardPage.tsx` con KPIs, gráfico de valor por sucursal y top productos.

### 📝 Tarjeta 6: Módulo de Transferencias entre Sucursales
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Usar un flujo de dos fases (Envío -> Tránsito -> Recepción) es la única forma auditable de manejar pérdidas durante el transporte y hacer recepciones parciales.
**Checklist Técnica:**
- [x] **PostgreSQL:** Crear tabla `transfer` (estados: PENDING, SHIPPED, COMPLETED, PARTIAL) y `transfer_detail`.
- [x] **Spring Boot:** Endpoint `POST /api/transfers/ship` -> Descuenta stock en sucursal origen.
- [x] **Spring Boot:** Endpoint `POST /api/transfers/receive` -> Lógica para recepción.
- [x] **Spring Boot:** Lógica de recepción parcial: Si la cantidad recibida es menor a la enviada, calcular faltante y registrar en tabla de `inventory_adjustment` (Merma).
- [x] **React (TS):** `TransferSendForm.tsx` — formulario de emisión de transferencia.
- [x] **React (TS):** `TransferHistory.tsx` — historial con modal de recepción parcial integrado.

### 📝 Tarjeta 5: Módulo de Ventas — Punto de Venta (POS)
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** La validación de stock *debe* ser concurrente en el motor de BD (usando `SELECT ... FOR UPDATE`) para evitar saldos negativos si dos cajeros venden el último artículo al mismo tiempo.
**Checklist Técnica:**
- [x] **PostgreSQL:** Crear tablas `sale` y `sale_detail`.
- [x] **Spring Boot:** Crear endpoint `POST /api/sales`.
- [x] **Spring Boot:** Implementar validación estricta de saldo. Si `cantidad_venta > stock_actual`, lanzar excepción (`HTTP 400`).
- [x] **Spring Boot:** Aplicar bloqueo pesimista en la fila del inventario al descontar (`@Lock(LockModeType.PESSIMISTIC_WRITE)`).
- [x] **React (TS):** `POSForm.tsx` — Caja registradora con catálogo, carrito, y validación visual de stock en 0.
- [x] **React (TS):** `SalesHistory.tsx` — historial de ventas con detalle expandible.

### 📝 Tarjeta 9: Documentación y Evidencia de IA
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** La transparencia en el uso de herramientas de IA durante el desarrollo es vital para justificar decisiones arquitectónicas y evaluar el prompt engineering.
**Checklist Técnica:**
- [x] Recopilar logs/transcripciones del asistente.
- [x] Redactar documento Markdown con casos de uso de IA (ej. generación de queries, configuración de Docker).
- [x] Revisión final del código generado para asegurar cumplimiento de estándares de calidad.

### 📝 Tarjeta 4: Módulo de Compras (Costo Promedio Ponderado)
**Etiqueta:** `[MVP]`
**¿Por qué se hizo así?** Calcular el costo promedio ponderado en el backend al momento de registrar la compra garantiza que la lógica financiera no dependa de manipulaciones del cliente (seguridad y consistencia).
**Checklist Técnica:**
- [x] **PostgreSQL:** Crear tabla `purchase` y `purchase_detail`.
- [x] **Spring Boot:** Crear endpoint `POST /api/purchases`.
- [x] **Spring Boot:** Implementar lógica transaccional (`@Transactional`) que inserta registro, recalcula CPP y aumenta stock local.
- [x] **React (TS):** Crear formulario maestro-detalle y vistas para registrar facturas de proveedores.

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
- [x] **Spring Boot:** Entidades JPA, repositorios e interfaces de servicio.
- [x] **Spring Boot:** Exponer endpoints REST CRUD (`GET`, `POST`, `PUT`) para Productos y Sucursales.
- [x] **React (TS):** Crear interfaces/tipos TypeScript (`Product`, `Branch`).
- [x] **React (TS):** Desarrollar vistas (Tablas y Formularios) para dar de alta productos y sucursales, consumiendo la API.

---

## 🐛 BUGS / DUDAS (Bloqueos)
*(Vacío — todos los módulos MVP están completados)*
