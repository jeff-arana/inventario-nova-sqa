const { createProductsService } = require('../src/services');

describe('SQA | integración de acceso a datos con doble controlado', () => {
  let execute; let service;
  beforeEach(() => { execute = jest.fn(); service = createProductsService({ execute }); });
  test('lista con consultas parametrizadas', async () => {
    execute.mockResolvedValue([[{ id: 1, name: 'Teclado' }]]);
    expect(await service.list("' OR 1=1 --")).toHaveLength(1);
    expect(execute.mock.calls[0][1][0]).toContain("' OR 1=1 --");
    expect(execute.mock.calls[0][0]).not.toContain('1=1');
  });
  test('find devuelve registro o null', async () => {
    execute.mockResolvedValueOnce([[{ id: 2 }]]).mockResolvedValueOnce([[]]);
    expect((await service.find(2)).id).toBe(2);
    expect(await service.find(99)).toBeNull();
  });
  test('create inserta y luego consulta', async () => {
    execute.mockResolvedValueOnce([{ insertId: 3 }]).mockResolvedValueOnce([[{ id: 3 }]]);
    expect((await service.create({ sku: 'ABCD', name: 'Prueba', category: 'Otros', price: 1, stock: 1 })).id).toBe(3);
  });
  test('update comprueba affectedRows', async () => {
    execute.mockResolvedValueOnce([{ affectedRows: 1 }]).mockResolvedValueOnce([[{ id: 2 }]]);
    expect((await service.update(2, { sku: 'ABCD', name: 'Prueba', category: 'Otros', price: 1, stock: 1 })).id).toBe(2);
  });
  test('update responde null si no existe', async () => {
    execute.mockResolvedValue([{ affectedRows: 0 }]);
    expect(await service.update(5, { sku: 'ABCD', name: 'Prueba', category: 'Otros', price: 1, stock: 1 })).toBeNull();
  });
  test.each([[1, true], [0, false]])('remove según filas afectadas %i', async (count, expected) => {
    execute.mockResolvedValue([{ affectedRows: count }]);
    expect(await service.remove(3)).toBe(expected);
  });
});
