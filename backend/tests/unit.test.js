const { validateProduct, parsePositiveId, stockStatus } = require('../src/validation');
const good = { sku: 'NOV-120', name: 'Laptop Dell', category: 'Computación', price: 5500, stock: 5 };

describe('SQA | pruebas unitarias de las reglas de negocio', () => {
  test('acepta un producto válido y normaliza el SKU', () => {
    expect(validateProduct({ ...good, sku: 'nov-120' })).toMatchObject({ valid: true, value: { sku: 'NOV-120' } });
  });
  test.each([null, [], 'producto'])('rechaza estructura inválida %s', (value) => {
    expect(validateProduct(value).valid).toBe(false);
  });
  test.each([-1, NaN, Infinity, '5'])('rechaza precio no permitido %s', (price) => {
    expect(validateProduct({ ...good, price }).errors.price).toBeDefined();
  });
  test.each([-1, 1.2, '3'])('rechaza existencia no entera %s', (stock) => {
    expect(validateProduct({ ...good, stock }).errors.stock).toBeDefined();
  });
  test('rechaza nombre, categoría y SKU fuera de formato', () => {
    const checked = validateProduct({ ...good, name: 'X', sku: '*', category: '' });
    expect(Object.keys(checked.errors)).toEqual(expect.arrayContaining(['name', 'sku', 'category']));
  });
  test.each([['0', null], ['-2', null], ['1.5', null], ['abc', null], ['4', 4]])('verifica ID %s', (raw, expected) => {
    expect(parsePositiveId(raw)).toBe(expected);
  });
  test.each([[0, 'Agotado'], [2, 'Bajo'], [5, 'Bajo'], [6, 'Disponible']])('clasifica stock %i', (stock, status) => {
    expect(stockStatus(stock)).toBe(status);
  });
});
