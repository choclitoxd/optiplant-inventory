import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AlertPanel } from '../alerts/AlertPanel';

describe('AlertPanel Component', () => {
  const mockAlerts = [
    {
      inventoryId: 1,
      branchName: 'Central',
      productName: 'Lentes de Contacto',
      productSku: 'L-01',
      currentStock: 0,
      minStockThreshold: 10,
      severity: 'CRITICAL' as const,
      suggestedReorderQuantity: 20
    },
    {
      inventoryId: 2,
      branchName: 'Norte',
      productName: 'Gafas de Sol',
      productSku: 'G-04',
      currentStock: 5,
      minStockThreshold: 10,
      severity: 'WARNING' as const,
      suggestedReorderQuantity: 15
    }
  ];

  it('debe renderizar badges CRITICAL y WARNING basados en la data', async () => {
    render(<AlertPanel alerts={mockAlerts} onOpenEmailModal={() => {}} />);
    
    expect(screen.getByText('Lentes de Contacto')).toBeInTheDocument();
    expect(screen.getByText('Gafas de Sol')).toBeInTheDocument();

    const criticalBadge = screen.getByText(/CRITICAL/i);
    expect(criticalBadge).toBeInTheDocument();
    
    const warningBadge = screen.getByText(/WARNING/i);
    expect(warningBadge).toBeInTheDocument();
  });

  it('debe invocar onOpenEmailModal al hacer clic en el botón', async () => {
    const handleOpenModal = vi.fn();
    render(<AlertPanel alerts={mockAlerts} onOpenEmailModal={handleOpenModal} />);
    const user = userEvent.setup();

    const openModalBtn = screen.getByRole('button', { name: /Enviar Reporte/i });
    await user.click(openModalBtn);

    expect(handleOpenModal).toHaveBeenCalledTimes(1);
  });
});
