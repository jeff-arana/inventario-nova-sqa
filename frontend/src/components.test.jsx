import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { emptyProduct, formatCurrency, getStatus, productToPayload, summarize } from './utils';

const product = { id: 1, sku: 'TEC-001', name: 'Laptop Lenovo', category: 'Computación', price: 1500, stock: 4 };
describe('SQA | componentes y regresión visual semántica', () => {
  it('muestra filas y estado de stock', () => {
    render(<ProductTable products={[product]} onEdit={() => {}} onRemove={() => {}} />);
    expect(screen.getByText('Laptop Lenovo')).toBeInTheDocument();
    expect(screen.getByText('Bajo')).toBeInTheDocument();
  });
  it('estado vacío informa al usuario', () => {
    render(<ProductTable products={[]} onEdit={() => {}} onRemove={() => {}} />);
    expect(screen.getByText(/No hay productos/i)).toBeInTheDocument();
  });
  it('editar llama al callback apropiado', () => {
    const edit = vi.fn();
    render(<ProductTable products={[product]} onEdit={edit} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar Laptop Lenovo' }));
    expect(edit).toHaveBeenCalledWith(product);
  });
  it('eliminar llama al callback apropiado', () => {
    const remove = vi.fn();
    render(<ProductTable products={[product]} onEdit={() => {}} onRemove={remove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Laptop Lenovo' }));
    expect(remove).toHaveBeenCalledWith(product);
  });
  it('formulario rechaza SKU inválido', async () => {
    const save = vi.fn();
    render(<ProductForm initial={{ ...product, sku: '$' }} onSave={save} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(save).not.toHaveBeenCalled();
  });
  it('formulario permite guardar', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    render(<ProductForm initial={product} onSave={save} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }));
    await waitFor(() => expect(save).toHaveBeenCalledWith(expect.objectContaining({ sku: 'TEC-001', price: 1500, stock: 4 })));
  });
  it('cerrar formulario ejecuta callback', () => {
    const cancel = vi.fn();
    render(<ProductForm initial={product} onSave={() => {}} onCancel={cancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar formulario' }));
    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
describe('SQA | utilidades', () => {
  it('formatea precios en quetzales', () => expect(formatCurrency(100)).toContain('100'));
  it('clasifica existencia 0, 3, 10', () => {
    expect(getStatus(0)).toBe('Agotado');
    expect(getStatus(3)).toBe('Bajo');
    expect(getStatus(10)).toBe('Disponible');
  });
  it('convierte tipos de formulario', () => {
    expect(productToPayload({ ...emptyProduct, price: '42.5', stock: '2' })).toMatchObject({ price: 42.5, stock: 2 });
  });
  it('calcula métricas de forma consistente', () => {
    expect(summarize([product])).toEqual({ total: 1, units: 4, low: 1, value: 6000 });
    expect(summarize([])).toEqual({ total: 0, units: 0, low: 0, value: 0 });
  });
});
