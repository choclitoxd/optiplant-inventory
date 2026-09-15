import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { TransferSendForm } from '../transfer/TransferSendForm';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TransferSendForm Component', () => {
  it('debe impedir seleccionar la misma sucursal como origen y destino', async () => {
    render(<TransferSendForm />);
    const user = userEvent.setup();

    const originSelect = screen.getByLabelText(/Sucursal Origen/i);
    await user.selectOptions(originSelect, '1');

    const destinationSelect = screen.getByLabelText(/Sucursal Destino/i);
    await user.selectOptions(destinationSelect, '1');

    const submitButton = screen.getByRole('button', { name: /Enviar Transferencia/i });
    await user.click(submitButton);

    await waitFor(() => {
      const errorMsg = screen.getByText(/La sucursal de origen y destino no pueden ser la misma/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });

  it('debe despachar la orden exitosamente y limpiar el formulario', async () => {
    render(<TransferSendForm />);
    const user = userEvent.setup();

    const originSelect = screen.getByLabelText(/Sucursal Origen/i);
    await user.selectOptions(originSelect, '1');

    const destinationSelect = screen.getByLabelText(/Sucursal Destino/i);
    await user.selectOptions(destinationSelect, '2');

    const productSelect = screen.getByLabelText(/Producto/i);
    await user.selectOptions(productSelect, '5');

    const quantityInput = screen.getByLabelText(/Cantidad a enviar/i);
    await user.type(quantityInput, '10');

    const addButton = screen.getByRole('button', { name: /Agregar Detalle/i });
    await user.click(addButton);

    const submitButton = screen.getByRole('button', { name: /Enviar Transferencia/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Transferencia enviada correctamente/i)).toBeInTheDocument();
    });

    // Validar limpieza del formulario (selects vuelven al estado por defecto)
    expect((originSelect as HTMLSelectElement).value).toBe('');
    expect((destinationSelect as HTMLSelectElement).value).toBe('');
    expect(screen.queryByText('Producto ID: 5')).not.toBeInTheDocument();
  });
});
