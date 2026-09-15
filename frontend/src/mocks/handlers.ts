import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock para Ventas (POS)
  http.post('*/api/sales', async ({ request }) => {
    const body = (await request.json()) as any;

    // Simulamos error 400 por concurrencia si se manda una cantidad exagerada para un producto específico
    if (body.details.some((d: { quantity: number }) => d.quantity > 50)) {
      return HttpResponse.json(
        { message: 'Stock insuficiente para realizar la venta' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { message: 'Venta registrada con éxito', saleId: 1001 },
      { status: 200 }
    );
  }),

  // Mock para Transferencias
  http.post('*/api/transfers/send', async ({ request }) => {
    const body = (await request.json()) as any;

    if (body.originBranchId === body.destinationBranchId) {
      return HttpResponse.json(
        { message: 'La sucursal de origen y destino no pueden ser la misma.' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { message: 'Transferencia enviada correctamente', transferId: 500 },
      { status: 200 }
    );
  }),

  // Mock para Alertas (Dashboard)
  http.get('*/api/alerts/low-stock', () => {
    return HttpResponse.json(
      [
        {
          inventoryId: 1,
          branchName: 'Central',
          productName: 'Lentes de Contacto',
          currentStock: 0,
          minStockThreshold: 10,
          severity: 'CRITICAL',
          suggestedReorderQuantity: 20
        },
        {
          inventoryId: 2,
          branchName: 'Norte',
          productName: 'Gafas de Sol',
          currentStock: 5,
          minStockThreshold: 10,
          severity: 'WARNING',
          suggestedReorderQuantity: 15
        }
      ],
      { status: 200 }
    );
  }),

  // Mock para enviar reporte SMTP
  http.post('*/api/alerts/email', () => {
    return HttpResponse.json(
      { message: 'Reporte enviado exitosamente' },
      { status: 200 }
    );
  }),

  // Mocks auxiliares para formularios (sucursales, productos, inventario)
  http.get('*/api/branches', () => {
    return HttpResponse.json(
      [{ id: 1, name: 'Central', address: 'Av 1', active: true }, { id: 2, name: 'Norte', address: 'Av 2', active: true }],
      { status: 200 }
    );
  }),
  http.get('*/api/products', () => {
    return HttpResponse.json(
      [{ id: 10, sku: 'L-01', name: 'Lentes', basePrice: 100 }, { id: 5, sku: 'L-02', name: 'Gafas', basePrice: 200 }],
      { status: 200 }
    );
  }),
  http.get('*/api/inventories/branch/:branchId', () => {
    return HttpResponse.json(
      [{ id: 1, branchId: 1, productId: 10, stock: 100 }, { id: 2, branchId: 1, productId: 5, stock: 0 }, { id: 3, branchId: 2, productId: 5, stock: 50 }],
      { status: 200 }
    );
  })
];
