import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../../mocks/handlers';
import { POSForm } from '../sale/POSForm';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('POSForm Component', () => {
  it('debe seleccionar sucursal y producto, y habilitar cobro con stock suficiente', async () => {
    render(<POSForm />);
    const user = userEvent.setup();

    // Simular selección de sucursal y producto
    const branchSelect = screen.getByLabelText(/Sucursal/i);
    await user.selectOptions(branchSelect, '1'); // ID Sucursal Central

    const productSelect = screen.getByLabelText(/Producto/i);
    await user.selectOptions(productSelect, '10'); // ID Lentes (Stock: 100)

    const quantityInput = screen.getByLabelText(/Cantidad/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '5');

    const addButton = screen.getByRole('button', { name: /Agregar al carrito/i });
    await user.click(addButton);

    // Verificar carrito
    expect(screen.getByText('Producto ID: 10')).toBeInTheDocument();
    
    // Verificar que el botón de cobro esté habilitado
    const checkoutButton = screen.getByRole('button', { name: /Cobrar/i });
    expect(checkoutButton).not.toBeDisabled();

    await user.click(checkoutButton);
    
    // Verificar éxito de MSW
    await waitFor(() => {
      expect(screen.getByText(/Venta registrada con éxito/i)).toBeInTheDocument();
    });
  });

  it('debe deshabilitar el botón de cobro si la cantidad supera el stock local', async () => {
    render(<POSForm />);
    const user = userEvent.setup();

    const branchSelect = screen.getByLabelText(/Sucursal/i);
    await user.selectOptions(branchSelect, '1');

    const productSelect = screen.getByLabelText(/Producto/i);
    await user.selectOptions(productSelect, '10'); // Asumimos mock de stock = 10

    const quantityInput = screen.getByLabelText(/Cantidad/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '15'); // Mayor al stock

    const addButton = screen.getByRole('button', { name: /Agregar al carrito/i });
    await user.click(addButton);

    const checkoutButton = screen.getByRole('button', { name: /Cobrar/i });
    expect(checkoutButton).toBeDisabled();
    expect(screen.getByText(/Stock insuficiente/i)).toBeInTheDocument();
  });

  it('debe mostrar banner rojo en caso de error 400 por concurrencia', async () => {
    render(<POSForm />);
    const user = userEvent.setup();

    const branchSelect = screen.getByLabelText(/Sucursal/i);
    await user.selectOptions(branchSelect, '1');

    const productSelect = screen.getByLabelText(/Producto/i);
    await user.selectOptions(productSelect, '10');

    const quantityInput = screen.getByLabelText(/Cantidad/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '100'); // Fuerza el error 400 en el handler MSW

    const addButton = screen.getByRole('button', { name: /Agregar al carrito/i });
    await user.click(addButton);

    // En este caso, el UI permite intentar el cobro pero el backend lo rechaza
    const checkoutButton = screen.getByRole('button', { name: /Cobrar/i });
    // Habilitar a la fuerza o simular que el stock front era engañoso
    checkoutButton.removeAttribute('disabled');
    await user.click(checkoutButton);

    await waitFor(() => {
      const errorBanner = screen.getByRole('alert');
      expect(errorBanner).toBeInTheDocument();
      expect(errorBanner).toHaveTextContent(/Stock insuficiente para realizar la venta/i);
      expect(errorBanner).toHaveClass('bg-red-500'); // Verificar color rojo
    });
  });
});
