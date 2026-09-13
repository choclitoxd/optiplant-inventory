-- =========================================================
--  Sistema de Inventario Multi‑Sucursal - Esquema SQL
--  Cada tabla incluye una breve justificación que responde
--  a la pregunta: ¿Por qué se hizo así?
-- =========================================================

-- 1. Productos: almacena información estática del artículo.
--    Se necesita el costo promedio ponderado para valorar el inventario.
CREATE TABLE product (
    id              SERIAL PRIMARY KEY,
    sku             VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    base_price      DECIMAL(10,2) NOT NULL,
    average_cost    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Historial de costos para cálculo de promedio ponderado.
CREATE TABLE product_cost_history (
    id          SERIAL PRIMARY KEY,
    product_id  INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cost        DECIMAL(10,2) NOT NULL,
    effective_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sucursales: puntos de origen/destino de inventario.
CREATE TABLE branch (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    address     VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventario por sucursal y producto.
--    Un registro único por (branch, product) y controla que stock nunca sea negativo.
CREATE TABLE inventory (
    id                  SERIAL PRIMARY KEY,
    branch_id           INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id          INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    stock               INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock_threshold INT DEFAULT 0,
    last_updated        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (branch_id, product_id)
);

-- 4. Compras (entrada de stock).
--    Se registra el proveedor para trazabilidad.
CREATE TABLE purchase (
    id              SERIAL PRIMARY KEY,
    branch_id       INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    supplier_name   VARCHAR(150) NOT NULL,
    purchase_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount    DECIMAL(10,2) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_detail (
    id          SERIAL PRIMARY KEY,
    purchase_id INT NOT NULL REFERENCES purchase(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id  INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_cost   DECIMAL(10,2) NOT NULL,
    UNIQUE (purchase_id, product_id)
);

-- 5. Ventas (salida de stock).
CREATE TABLE sale (
    id          SERIAL PRIMARY KEY,
    branch_id   INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    sale_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_detail (
    id          SERIAL PRIMARY KEY,
    sale_id     INT NOT NULL REFERENCES sale(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id  INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10,2) NOT NULL,
    UNIQUE (sale_id, product_id)
);

-- 6. Transferencias entre sucursales.
--    Soporta estados parciales y captura timestamps de cada fase.
CREATE TABLE transfer (
    id                  SERIAL PRIMARY KEY,
    source_branch_id    INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_branch_id INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    status              VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING','SHIPPED','COMPLETED','PARTIAL')),
    requested_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shipped_at          TIMESTAMP,
    received_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Detalle de lo enviado. No se registra lo recibido aquí para mantener 3FN.
CREATE TABLE transfer_shipment_detail (
    id              SERIAL PRIMARY KEY,
    transfer_id     INT NOT NULL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id      INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity_shipped INT NOT NULL CHECK (quantity_shipped > 0),
    UNIQUE (transfer_id, product_id)
);

-- Registro de lo recibido (puede ser parcial).
CREATE TABLE transfer_receipt_detail (
    id              SERIAL PRIMARY KEY,
    transfer_id     INT NOT NULL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id      INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity_received INT NOT NULL CHECK (quantity_received >= 0),
    UNIQUE (transfer_id, product_id)
);

-- 7. Ajustes manuales de inventario (pérdidas, faltantes, inventario inicial).
CREATE TABLE inventory_adjustment (
    id                  SERIAL PRIMARY KEY,
    branch_id           INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id          INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    transfer_id         INT REFERENCES transfer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    adjustment_quantity INT NOT NULL,
    reason              VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Kardex / Movimientos de stock (trazabilidad completa)
--    Cada fila representa una transacción que afecta el inventario.
CREATE TABLE stock_movement (
    id              SERIAL PRIMARY KEY,
    movement_type   VARCHAR(20) NOT NULL
        CHECK (movement_type IN ('PURCHASE','SALE','TRANSFER_OUT','TRANSFER_IN','ADJUSTMENT')),
    reference_id    INT NOT NULL,                 -- id de purchase, sale, transfer, adjustment
    branch_id       INT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id      INT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity        INT NOT NULL CHECK (quantity <> 0),
    unit_cost       DECIMAL(10,2) NOT NULL,     -- costo unitario al momento del movimiento
    movement_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices de búsqueda comunes
CREATE INDEX idx_product_sku          ON product(sku);
CREATE INDEX idx_inventory_branch    ON inventory(branch_id);
CREATE INDEX idx_inventory_product   ON inventory(product_id);
CREATE INDEX idx_transfer_status    ON transfer(status);
CREATE INDEX idx_stock_movement_type ON stock_movement(movement_type);
