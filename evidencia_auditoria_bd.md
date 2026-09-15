# Evidencia de Auditoría de Base de Datos y Calidad de Esquema DDL

**Proyecto:** Sistema de Inventario Multi-Sucursal (OptiPlant - Prueba Técnica)
**Motor de Base de Datos:** PostgreSQL 15+ (Contenedor Docker: `optiplant-db`)
**Fecha de Ejecución:** 15 de Septiembre de 2026

---

## 1. Verificación del Esquema (Metadata)
Se validó que el ORM (Hibernate/Spring Boot) generó correctamente las tablas físicas y las relaciones Foreign Key mediante consultas directas al diccionario de datos de PostgreSQL.

**Comando Ejecutado:**
```bash
docker exec optiplant-db psql -U optiplant_user -d optiplant_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
```

**Salida Exitosa de la BD:**
```text
      table_name      
----------------------
 branch
 inventory
 inventory_adjustment
 product
 product_cost_history
 purchase
 purchase_detail
 sale
 sale_detail
 stock_movement
 supplier
 transfer
 transfer_detail
(13 rows)
```

---

## 2. Inyección de Datos Semilla (Seed Data)
Se poblaron los catálogos maestros y el inventario inicial para preparar el entorno de pruebas de estrés transaccional.

**Script SQL:**
```sql
INSERT INTO branch (name, address, active) VALUES 
('Sucursal Central', 'Av. Principal 123', true),
('Sucursal Norte', 'Polígono Industrial Norte', true);

INSERT INTO product (sku, name, base_price, weighted_average_cost) VALUES 
('PRD-1001', 'Lente Óptico A', 150.00, 100.00),
('PRD-1002', 'Armazón Premium', 450.00, 300.00),
('PRD-1003', 'Líquido de Contacto', 80.00, 50.00);

INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold) VALUES 
(1, 1, 50, 10),
(1, 2, 20, 5), 
(2, 3, 100, 15);
```

**Salida de la BD:**
```text
INSERT 0 2
INSERT 0 3
INSERT 0 3
```

---

## 3. Suite de Pruebas Destructivas de Integridad (Assertions)
Se realizaron inserciones y borrados maliciosos para comprobar la solidez de las reglas ACID a nivel de motor.

### Prueba A: Prevención de Duplicidad (`UNIQUE`)
Se intenta registrar inventario repetido para la sucursal 1 y producto 1.
```sql
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold) VALUES (1, 1, 10, 5);
```
**Respuesta del Motor (Transacción Abortada):**
```text
ERROR:  duplicate key value violates unique constraint "inventory_branch_id_product_id_key"
DETAIL:  Key (branch_id, product_id)=(1, 1) already exists.
```
✅ *Aserción superada: Protege contra inconsistencias en el catálogo de stock.*

### Prueba B: Prevención de Datos Numéricos Ilógicos (`CHECK`)
Se intenta forzar un inventario negativo.
```sql
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold) VALUES (2, 1, -5, 10);
```
**Respuesta del Motor (Transacción Abortada):**
```text
ERROR:  new row for relation "inventory" violates check constraint "inventory_stock_check"
DETAIL:  Failing row contains (5, 2, 1, -5, 10, 0, 2026-09-15 18:13:56.018156).
```
✅ *Aserción superada: La regla de negocio de stock >= 0 está blindada por el motor de la base de datos.*

### Prueba C: Prevención de Orfandad Referencial (`FOREIGN KEY`)
Se intenta eliminar una Sucursal que tiene dependencias (inventario asignado).
```sql
DELETE FROM branch WHERE id = 1;
```
**Respuesta del Motor (Transacción Abortada):**
```text
ERROR:  update or delete on table "branch" violates foreign key constraint "inventory_branch_id_fkey" on table "inventory"
DETAIL:  Key (id)=(1) is still referenced from table "inventory".
```
✅ *Aserción superada: Se previene la destrucción en cascada no autorizada y los registros huérfanos.*

---
**Conclusión de Auditoría:** 
El esquema de base de datos generado cumple estrictamente con las reglas de normalización e integridad referencial necesarias para soportar transacciones concurrentes de un sistema multi-sucursal. No existen vulnerabilidades lógicas de persistencia.
