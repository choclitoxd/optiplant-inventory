-- 1. ROLES
INSERT INTO roles (name) VALUES 
('ROLE_ADMIN'),
('ROLE_BRANCH_MANAGER'),
('ROLE_OPERATOR')
ON CONFLICT (name) DO NOTHING;

-- 2. SUCURSALES (Escenario: Multi-sucursal)
INSERT INTO branch (id, name, address, active) VALUES 
(1, 'Sede Principal', 'Av. Central 123', true),
(2, 'Sucursal Norte', 'Plaza Norte 456', true)
ON CONFLICT DO NOTHING;

-- 3. USUARIOS (Escenario: RBAC y aislamiento por sucursal)
-- Passwords are all 'admin123' (BCrypt hash)
INSERT INTO users (id, username, email, password, full_name, branch_id, active) VALUES 
(1, 'admin', 'admin@optiplant.com', '$2a$10$wY1vzscv7H3hD2Jc9IOf..9hXp1s0S/4fDMBkH31N4mB6Gz9XwLzW', 'Super Admin', null, true),
(2, 'gerente_norte', 'gerente@norte.com', '$2a$10$wY1vzscv7H3hD2Jc9IOf..9hXp1s0S/4fDMBkH31N4mB6Gz9XwLzW', 'Gerente Norte', 2, true),
(3, 'operador_norte', 'op@norte.com', '$2a$10$wY1vzscv7H3hD2Jc9IOf..9hXp1s0S/4fDMBkH31N4mB6Gz9XwLzW', 'Operador Norte', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- Admin
(2, 2), -- Manager
(3, 3)  -- Operator
ON CONFLICT DO NOTHING;

-- 4. PROVEEDORES (Escenario: Módulo de Compras)
INSERT INTO supplier (id, tax_id, company_name, contact_name, phone) VALUES 
(1, 'NIT-1001', 'AgroInsumos SA', 'Juan Perez', '555-0101'),
(2, 'NIT-1002', 'Herramientas Verdes', 'Ana Gomez', '555-0202')
ON CONFLICT DO NOTHING;

-- 5. PRODUCTOS (Escenario: Catálogo global con precios y CPP)
INSERT INTO product (id, sku, name, description, unit_of_measure, base_price, weighted_average_cost) VALUES 
(1, 'FERT-01', 'Fertilizante NPK', 'Saco 50kg', 'KG', 120000.00, 115000.00),
(2, 'MAC-01', 'Maceta Arcilla Grande', 'Maceta 50L', 'UND', 45000.00, 40000.00),
(3, 'TIE-01', 'Tierra Preparada', 'Bolsa 10kg', 'KG', 15000.00, 12000.00)
ON CONFLICT DO NOTHING;

-- 6. INVENTARIO (Escenario: Stock por debajo del umbral para Alertas, y Stock normal)
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold) VALUES 
(1, 1, 50, 10), -- Sede Principal: Buen stock
(1, 2, 5, 20),  -- Sede Principal: STOCK CRÍTICO (Generará alerta)
(2, 1, 8, 15),  -- Sucursal Norte: STOCK CRÍTICO (Generará alerta)
(2, 3, 100, 20) -- Sucursal Norte: Buen stock
ON CONFLICT DO NOTHING;

-- 7. TRANSFERENCIAS (Escenario: Transferencia PENDIENTE para que la otra sucursal la reciba)
INSERT INTO transfer (id, origin_branch_id, destination_branch_id, status, user_id) VALUES 
(1, 1, 2, 'PENDING', 1) -- Desde Principal a Norte, en tránsito
ON CONFLICT DO NOTHING;

INSERT INTO transfer_detail (transfer_id, product_id, quantity_sent) VALUES 
(1, 1, 10) -- Enviando 10 Fertilizantes
ON CONFLICT DO NOTHING;
