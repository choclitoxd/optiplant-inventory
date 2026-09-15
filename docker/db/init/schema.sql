-- =========================================================
--  Sistema de Inventario Multi‑Sucursal - Esquema SQL
--  Totalmente sincronizado con las entidades JPA
-- =========================================================

CREATE TABLE product (
    id                      BIGSERIAL PRIMARY KEY,
    sku                     VARCHAR(50) UNIQUE NOT NULL,
    name                    VARCHAR(150) NOT NULL,
    description             TEXT,
    unit_of_measure         VARCHAR(20),
    base_price              DECIMAL(10,2) NOT NULL,
    weighted_average_cost   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_cost_history (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    cost        DECIMAL(10,2) NOT NULL,
    effective_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branch (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    address     VARCHAR(255),
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id                  BIGSERIAL PRIMARY KEY,
    branch_id           BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id          BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    stock               INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock_threshold INT DEFAULT 0,
    version             INT NOT NULL DEFAULT 0,
    last_updated        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (branch_id, product_id)
);

CREATE TABLE supplier (
    id          BIGSERIAL PRIMARY KEY,
    tax_id      VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    phone       VARCHAR(20)
);

CREATE TABLE purchase (
    id              BIGSERIAL PRIMARY KEY,
    branch_id       BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    supplier_id     BIGINT NOT NULL REFERENCES supplier(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    responsible_user VARCHAR(100) NOT NULL,
    purchase_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount    DECIMAL(10,2) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_detail (
    id          BIGSERIAL PRIMARY KEY,
    purchase_id BIGINT NOT NULL REFERENCES purchase(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id  BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_cost   DECIMAL(10,2) NOT NULL,
    UNIQUE (purchase_id, product_id)
);

CREATE TABLE sale (
    id          BIGSERIAL PRIMARY KEY,
    branch_id   BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    sale_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_detail (
    id          BIGSERIAL PRIMARY KEY,
    sale_id     BIGINT NOT NULL REFERENCES sale(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id  BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10,2) NOT NULL,
    UNIQUE (sale_id, product_id)
);

CREATE TABLE transfer (
    id                  BIGSERIAL PRIMARY KEY,
    source_branch_id    BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    destination_branch_id BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    status              VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING','SHIPPED','COMPLETED','PARTIAL')),
    requested_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shipped_at          TIMESTAMP,
    received_at         TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfer_shipment_detail (
    id              BIGSERIAL PRIMARY KEY,
    transfer_id     BIGINT NOT NULL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity_shipped INT NOT NULL CHECK (quantity_shipped > 0),
    UNIQUE (transfer_id, product_id)
);

CREATE TABLE transfer_receipt_detail (
    id              BIGSERIAL PRIMARY KEY,
    transfer_id     BIGINT NOT NULL REFERENCES transfer(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity_received INT NOT NULL CHECK (quantity_received >= 0),
    UNIQUE (transfer_id, product_id)
);

CREATE TABLE inventory_adjustment (
    id                  BIGSERIAL PRIMARY KEY,
    branch_id           BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id          BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    transfer_id         BIGINT REFERENCES transfer(id) ON DELETE SET NULL ON UPDATE CASCADE,
    adjustment_quantity INT NOT NULL,
    reason              VARCHAR(255) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock_movement (
    id              BIGSERIAL PRIMARY KEY,
    movement_type   VARCHAR(20) NOT NULL
        CHECK (movement_type IN ('PURCHASE','SALE','TRANSFER_OUT','TRANSFER_IN','ADJUSTMENT')),
    reference_id    BIGINT NOT NULL,                 
    branch_id       BIGINT NOT NULL REFERENCES branch(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES product(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    quantity        INT NOT NULL CHECK (quantity <> 0),
    unit_cost       DECIMAL(10,2) NOT NULL,     
    movement_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_sku          ON product(sku);
CREATE INDEX idx_inventory_branch    ON inventory(branch_id);
CREATE INDEX idx_inventory_product   ON inventory(product_id);
CREATE INDEX idx_transfer_status    ON transfer(status);
CREATE INDEX idx_stock_movement_type ON stock_movement(movement_type);
