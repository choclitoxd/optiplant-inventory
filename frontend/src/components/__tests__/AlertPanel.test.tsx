import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { AlertPanel } from '../alerts/AlertPanel';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AlertPanel & EmailReportModal Component', () => {
  it('debe renderizar badges CRITICAL y WARNING basados en la data del mock', async () => {
    render(<AlertPanel />);
    
    // Esperar a que la petición a /api/alerts/low-stock se resuelva y los datos se pinten
    await waitFor(() => {
      expect(screen.getByText('Lentes de Contacto')).toBeInTheDocument();
      expect(screen.getByText('Gafas de Sol')).toBeInTheDocument();
    });

    // Validar el badge rojo (CRITICAL) y el badge amarillo (WARNING)
    const criticalBadge = screen.getByText('CRITICAL');
    expect(criticalBadge).toBeInTheDocument();
    expect(criticalBadge).toHaveClass('bg-red-500'); // Estilo Tailwind para CRITICAL

    const warningBadge = screen.getByText('WARNING');
    expect(warningBadge).toBeInTheDocument();
    expect(warningBadge).toHaveClass('bg-yellow-500'); // Estilo Tailwind para WARNING
  });

  it('debe abrir el modal de correo, ingresar un email y simular el envío del reporte', async () => {
    render(<AlertPanel />);
    const user = userEvent.setup();

    // Esperar que cargue
    await waitFor(() => {
      expect(screen.getByText('Lentes de Contacto')).toBeInTheDocument();
    });

    const openModalBtn = screen.getByRole('button', { name: /Enviar Reporte/i });
    await user.click(openModalBtn);

    // Verificar que el modal se abrió
    const modalTitle = screen.getByText(/Destinatario del Reporte/i);
    expect(modalTitle).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/ejemplo@optiplant.com/i);
    await user.type(emailInput, 'gerente@optiplant.com');

    const sendBtn = screen.getByRole('button', { name: /Enviar/i });
    await user.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Reporte enviado exitosamente/i)).toBeInTheDocument();
    });
    
    // Modal debe cerrarse automáticamente tras éxito
    await waitFor(() => {
      expect(screen.queryByText(/Destinatario del Reporte/i)).not.toBeInTheDocument();
    });
  });
});
