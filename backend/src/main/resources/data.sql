-- =========================================================
--  Sistema de Inventario Multi-Sucursal - Seed Data
-- =========================================================

-- Limpieza de tablas (Orden Inverso a FKs)
TRUNCATE TABLE stock_movement RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_adjustment RESTART IDENTITY CASCADE;
TRUNCATE TABLE transfer_detail RESTART IDENTITY CASCADE;
TRUNCATE TABLE transfer RESTART IDENTITY CASCADE;
TRUNCATE TABLE sale_detail RESTART IDENTITY CASCADE;
TRUNCATE TABLE sale RESTART IDENTITY CASCADE;
TRUNCATE TABLE purchase_detail RESTART IDENTITY CASCADE;
TRUNCATE TABLE purchase RESTART IDENTITY CASCADE;
TRUNCATE TABLE supplier RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory RESTART IDENTITY CASCADE;
TRUNCATE TABLE product_cost_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE product RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
TRUNCATE TABLE roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE branch RESTART IDENTITY CASCADE;

-- 1. Sucursales
INSERT INTO branch (id, name, address, active, created_at, updated_at) VALUES 
(1, 'Sucursal Bogotá - Norte', 'Calle 127 # 45-67, Bogotá', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Sucursal Medellín - Poblado', 'Carrera 43A # 3-101, Medellín', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Sucursal Cali - Sur', 'Avenida San Joaquín # 12-34, Cali', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_BRANCH_MANAGER'),
(3, 'ROLE_OPERATOR');

-- 3. Usuarios (Contraseña: password123, hash BCrypt)
    -- Hash utilizado: $2a$10$BIrV25uJolVYwrNm9A4RjOur.Fha16ovFVVaYQSTGDuqahb4E5eTy (válido para 'password123')
    INSERT INTO users (id, username, email, password, full_name, branch_id, active) VALUES 
    (1, 'admin', 'admin@optiplant.com', '$2a$10$BIrV25uJolVYwrNm9A4RjOur.Fha16ovFVVaYQSTGDuqahb4E5eTy', 'Administrador Principal', NULL, true),
    (2, 'gerente_bogota', 'gerente.bog@optiplant.com', '$2a$10$BIrV25uJolVYwrNm9A4RjOur.Fha16ovFVVaYQSTGDuqahb4E5eTy', 'Gerente Bogotá', 1, true),
    (3, 'cajero_bogota', 'cajero.bog@optiplant.com', '$2a$10$BIrV25uJolVYwrNm9A4RjOur.Fha16ovFVVaYQSTGDuqahb4E5eTy', 'Cajero Bogotá 1', 1, true);

-- 4. User Roles
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- Admin
(2, 2), -- Gerente
(3, 3); -- Operador

-- 5. Productos (Catálogo Vivero / Jardinería)
INSERT INTO product (id, sku, name, description, unit_of_measure, base_price, weighted_average_cost, created_at, updated_at) VALUES 
(1, 'VIV-FER-01', 'Fertilizante Orgánico Universal 1KG', 'Abono enriquecido para plantas de interior y exterior.', 'KG', 12.50, 8.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'VIV-TIE-02', 'Tierra Preparada Premium 5KG', 'Sustrato con perlita, fibra de coco y humus de lombriz.', 'Bolsa', 15.00, 10.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'VIV-MAC-03', 'Maceta de Cerámica Decorativa', 'Maceta esmaltada de 20cm de diámetro.', 'Unidad', 25.00, 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'VIV-PLA-04', 'Monstera Deliciosa (Costilla de Adán)', 'Planta de interior, altura 60cm.', 'Unidad', 45.00, 25.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'VIV-HER-05', 'Tijeras de Podar Profesionales', 'Tijeras de acero inoxidable con mango ergonómico.', 'Unidad', 35.00, 22.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'VIV-SEM-06', 'Semillas de Lavanda', 'Sobre de semillas puras para clima templado.', 'Sobre', 5.00, 2.50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Proveedores
INSERT INTO supplier (id, tax_id, company_name, contact_name, phone) VALUES 
(1, 'NIT-900123456-1', 'AgroInsumos Nacionales S.A.', 'Carlos Restrepo', '3001234567'),
(2, 'NIT-800987654-2', 'Cerámicas y Decoración SAS', 'María Giraldo', '3159876543');

-- 7. Compras (Histórico con Costos) - Se usa user_id = 1 (admin)
INSERT INTO purchase (id, branch_id, supplier_id, user_id, purchase_date, total_amount, created_at) VALUES 
(1, 1, 1, 1, CURRENT_TIMESTAMP - INTERVAL '30 days', 500.00, CURRENT_TIMESTAMP - INTERVAL '30 days'),
(2, 2, 2, 1, CURRENT_TIMESTAMP - INTERVAL '15 days', 450.00, CURRENT_TIMESTAMP - INTERVAL '15 days');

INSERT INTO purchase_detail (purchase_id, product_id, quantity, unit_cost) VALUES 
(1, 1, 50, 8.00),
(1, 2, 10, 10.00),
(2, 3, 30, 15.00);

-- 8. Inventario por Sucursal (Con estados Crítico, Advertencia y Normal)
-- Sucursal Bogotá
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold, version, last_updated) VALUES 
(1, 1, 100, 20, 1, CURRENT_TIMESTAMP), -- Normal
(1, 2, 5, 10, 1, CURRENT_TIMESTAMP),   -- Advertencia
(1, 3, 0, 5, 1, CURRENT_TIMESTAMP);    -- Crítico

-- Sucursal Medellín
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold, version, last_updated) VALUES 
(2, 4, 30, 5, 1, CURRENT_TIMESTAMP),   -- Normal
(2, 5, 2, 5, 1, CURRENT_TIMESTAMP),    -- Advertencia
(2, 6, 0, 15, 1, CURRENT_TIMESTAMP);   -- Crítico

-- Sucursal Cali
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold, version, last_updated) VALUES 
(3, 1, 0, 10, 1, CURRENT_TIMESTAMP),   -- Crítico
(3, 2, 50, 15, 1, CURRENT_TIMESTAMP),  -- Normal
(3, 4, 8, 10, 1, CURRENT_TIMESTAMP);   -- Advertencia

-- 9. Ventas POS Históricas - Se usa user_id = 3 (cajero_bogota) y user_id = 1 (admin)
INSERT INTO sale (id, branch_id, sale_date, total_amount, user_id, created_at) VALUES 
(1, 1, CURRENT_TIMESTAMP - INTERVAL '5 days', 62.50, 3, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 2, CURRENT_TIMESTAMP - INTERVAL '2 days', 90.00, 1, CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO sale_detail (sale_id, product_id, quantity, unit_price, subtotal) VALUES 
(1, 1, 5, 12.50, 62.50),
(2, 4, 2, 45.00, 90.00);

-- 10. Transferencias - Se usa user_id = 2 (gerente_bogota)
-- Fase 1: Transferencia Completada Totalmente
INSERT INTO transfer (id, origin_branch_id, destination_branch_id, send_date, receive_date, status, user_id) VALUES 
(1, 1, 2, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '8 days', 'COMPLETED', 2);

INSERT INTO transfer_detail (transfer_id, product_id, quantity_sent, quantity_received) VALUES 
(1, 1, 20, 20);

-- Fase 2: Transferencia Parcial con Mermas / Pérdidas (PARTIAL_RECEIPT)
INSERT INTO transfer (id, origin_branch_id, destination_branch_id, send_date, receive_date, status, user_id) VALUES 
(2, 2, 3, CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 days', 'COMPLETED', 2);

INSERT INTO transfer_detail (transfer_id, product_id, quantity_sent, quantity_received) VALUES 
(2, 4, 10, 8); -- Se enviaron 10, pero solo llegaron 8 (2 se perdieron en logística)

-- Reiniciar Secuencias
SELECT setval('branch_id_seq', (SELECT MAX(id) FROM branch));
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
SELECT setval('supplier_id_seq', (SELECT MAX(id) FROM supplier));
SELECT setval('purchase_id_seq', (SELECT MAX(id) FROM purchase));
SELECT setval('sale_id_seq', (SELECT MAX(id) FROM sale));
SELECT setval('transfer_id_seq', (SELECT MAX(id) FROM transfer));
