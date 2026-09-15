-- A. Inserción de Sucursales
INSERT INTO branch (name, address, active) VALUES 
('Sucursal Central', 'Av. Principal 123', true),
('Sucursal Norte', 'Polígono Industrial Norte', true);

-- B. Inserción de Productos
INSERT INTO product (sku, name, base_price, weighted_average_cost) VALUES 
('PRD-1001', 'Lente Óptico A', 150.00, 100.00),
('PRD-1002', 'Armazón Premium', 450.00, 300.00),
('PRD-1003', 'Líquido de Contacto', 80.00, 50.00);

-- C. Carga Inicial de Inventario (ID's asumidos por ser los primeros inserts)
INSERT INTO inventory (branch_id, product_id, stock, min_stock_threshold) VALUES 
(1, 1, 50, 10), -- Central: 50 Lentes Ópticos A
(1, 2, 20, 5),  -- Central: 20 Armazones Premium
(2, 3, 100, 15); -- Norte: 100 Líquidos de contacto
