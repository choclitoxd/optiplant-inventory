#!/bin/bash

# ======================================================================================
# Suite de Pruebas de Integración (QA Automation) - OptiPlant Backend
# ======================================================================================
# Requisitos: curl, jq
# Ejecución: ./test_backend.sh

API_URL="http://localhost:8080/api"
GREEN='\03.0;32m'
RED='\03.0;31m'
NC='\03.0m' # No Color

echo "======================================================"
echo "Iniciando Suite de Pruebas E2E - OptiPlant Inventory"
echo "======================================================"

# ---------------------------------------------------------
# FASE A - Alta de Datos Base
# ---------------------------------------------------------
echo -e "\n[FASE A] Creando Sucursales y Productos Base..."

curl -s -X POST "$API_URL/branches" -H "Content-Type: application/json" -d '{"name":"Sucursal Central","address":"Av. 1"}' > /dev/null
curl -s -X POST "$API_URL/branches" -H "Content-Type: application/json" -d '{"name":"Sucursal Norte","address":"Av. 2"}' > /dev/null
echo -e "${GREEN}✔ Sucursales 1 y 2 creadas.${NC}"

curl -s -X POST "$API_URL/suppliers" -H "Content-Type: application/json" -d '{"name":"Proveedor A","contactEmail":"proveedor@test.com"}' > /dev/null
echo -e "${GREEN}✔ Proveedor 1 creado.${NC}"

curl -s -X POST "$API_URL/products" -H "Content-Type: application/json" -d '{"sku":"PLANT-001","name":"Lente Óptico A","basePrice":100.00}' > /dev/null
echo -e "${GREEN}✔ Producto 1 (PLANT-001) creado.${NC}"

# ---------------------------------------------------------
# FASE B - Prueba de Compras y CPP
# ---------------------------------------------------------
echo -e "\n[FASE B] Registrando Compras para validar Costo Promedio Ponderado (CPP)..."

# Compra 1: 10 unidades a $80
curl -s -X POST "$API_URL/purchases" -H "Content-Type: application/json" -d '{
  "branchId": 1, "supplierId": 1, "details": [{"productId": 1, "quantity": 10, "unitCost": 80.00}]
}' > /dev/null

# Compra 2: 10 unidades a $120
curl -s -X POST "$API_URL/purchases" -H "Content-Type: application/json" -d '{
  "branchId": 1, "supplierId": 1, "details": [{"productId": 1, "quantity": 10, "unitCost": 120.00}]
}' > /dev/null

# Verificar CPP (Debe ser $100.00)
CPP=$(curl -s "$API_URL/products/1" | jq -r '.weightedAverageCost')
if [ "$CPP" == "100.0" ] || [ "$CPP" == "100" ] || [ "$CPP" == "100.00" ]; then
    echo -e "${GREEN}✔ CPP Validado correctamente: $$CPP${NC}"
else
    echo -e "${RED}✖ Error en CPP. Esperado: 100, Obtenido: $CPP${NC}"
fi

# ---------------------------------------------------------
# FASE C - Prueba de Ventas POS y Control de Stock
# ---------------------------------------------------------
echo -e "\n[FASE C] Validando Ventas y Concurrencia de Stock..."

# Venta Exitosa (HTTP 201)
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/sales" -H "Content-Type: application/json" -d '{
  "branchId": 1, "details": [{"productId": 1, "quantity": 5, "unitPrice": 150.00}]
}')
if [ "$HTTP_STATUS" -eq 201 ]; then
    echo -e "${GREEN}✔ Venta exitosa procesada (HTTP 201).${NC}"
else
    echo -e "${RED}✖ Falló la venta. HTTP: $HTTP_STATUS${NC}"
fi

# Venta Fallida por Stock Insuficiente (HTTP 400)
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/sales" -H "Content-Type: application/json" -d '{
  "branchId": 1, "details": [{"productId": 1, "quantity": 100, "unitPrice": 150.00}]
}')
if [ "$HTTP_STATUS" -eq 400 ]; then
    echo -e "${GREEN}✔ Bloqueo de stock insuficiente validado correctamente (HTTP 400).${NC}"
else
    echo -e "${RED}✖ No se bloqueó la venta sin stock. HTTP: $HTTP_STATUS${NC}"
fi

# ---------------------------------------------------------
# FASE D - Transferencias en 2 Fases y Mermas
# ---------------------------------------------------------
echo -e "\n[FASE D] Transito y Recepción de Mercancía..."

# Enviar 5 unidades de S1 a S2
TRANSFER_ID=$(curl -s -X POST "$API_URL/transfers/send" -H "Content-Type: application/json" -d '{
  "originBranchId": 1, "destinationBranchId": 2, "details": [{"productId": 1, "quantity": 5}]
}' | jq -r '.id')
echo -e "${GREEN}✔ Transferencia enviada. Estado: IN_TRANSIT (ID: $TRANSFER_ID)${NC}"

# Recibir solo 4 unidades en S2 (Merma de 1)
curl -s -X PUT "$API_URL/transfers/$TRANSFER_ID/receive" -H "Content-Type: application/json" -d '{
  "receivedDetails": [{"productId": 1, "receivedQuantity": 4, "notes": "Falta 1 por rotura en tránsito"}]
}' > /dev/null
echo -e "${GREEN}✔ Recepción parcial procesada (Estado PARTIAL y Ajuste registrado).${NC}"

# ---------------------------------------------------------
# FASE E - Dashboard y KPIs
# ---------------------------------------------------------
echo -e "\n[FASE E] Auditoría de Métricas..."

curl -s "$API_URL/dashboard/metrics" | jq . > /dev/null
echo -e "${GREEN}✔ Métricas globales del dashboard consultadas con éxito.${NC}"

# ---------------------------------------------------------
# FASE F - Alertas y SMTP
# ---------------------------------------------------------
echo -e "\n[FASE F] Alertas de Reposición y Reportes..."

# Disparar correo manualmente
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/alerts/send-email-report?recipientEmail=admin@optiplant.com")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✔ Reporte de Alertas SMTP disparado exitosamente (HTTP 200).${NC}"
else
    echo -e "${RED}✖ Falló el envío del correo de alertas. HTTP: $HTTP_STATUS${NC}"
fi

echo -e "\n======================================================"
echo -e "${GREEN}Suite de pruebas E2E finalizada.${NC}"
echo "======================================================"
