const request = require('supertest');
const { createApp } = require('../src/app');

const fakeProduct = { id: 7, sku: 'NOV-0007', name: 'Mouse inalámbrico', category: 'Accesorios', price: 90, stock: 4 };
let service;
let app;

beforeEach(() => {
  service = {
    list: jest.fn().mockResolvedValue([fakeProduct]),
    find: jest.fn().mockResolvedValue(fakeProduct),
    create: jest.fn().mockResolvedValue(fakeProduct),
    update: jest.fn().mockResolvedValue(fakeProduct),
    remove: jest.fn().mockResolvedValue(true),
  };
  app = createApp(service);
});

const payload = { sku: 'NOV-0007', name: 'Mouse inalámbrico', category: 'Accesorios', price: 90, stock: 4 };

describe('SQA | integración HTTP con Supertest', () => {
  test('GET /health responde sano', async () => {
    await request(app).get('/api/health').expect(200, { status: 'ok', app: 'Inventario Nova' });
  });
  test('GET /products lista, busca y clasifica', async () => {
    const result = await request(app).get('/api/products?search=Mouse').expect(200);
    expect(result.body.data[0].status).toBe('Bajo');
    expect(service.list).toHaveBeenCalledWith('Mouse');
  });
  test('GET /products/:id devuelve un registro', async () => {
    const result = await request(app).get('/api/products/7').expect(200);
    expect(result.body.data.sku).toBe('NOV-0007');
  });
  test('POST crea producto validado', async () => {
    await request(app).post('/api/products').send(payload).expect(201);
    expect(service.create).toHaveBeenCalledWith(payload);
  });
  test('PUT modifica producto', async () => {
    await request(app).put('/api/products/7').send(payload).expect(200);
    expect(service.update).toHaveBeenCalledWith(7, payload);
  });
  test('DELETE elimina producto', async () => {
    await request(app).delete('/api/products/7').expect(204);
    expect(service.remove).toHaveBeenCalledWith(7);
  });
  test('rechaza precio negativo sin tocar base', async () => {
    await request(app).post('/api/products').send({ ...payload, price: -1 }).expect(422);
    expect(service.create).not.toHaveBeenCalled();
  });
  test('rechaza ID inválido', async () => {
    await request(app).get('/api/products/abc').expect(400);
    await request(app).put('/api/products/abc').send(payload).expect(400);
    await request(app).delete('/api/products/abc').expect(400);
  });
  test('responde 404 para registro inexistente', async () => {
    service.find.mockResolvedValue(null);
    service.update.mockResolvedValue(null);
    service.remove.mockResolvedValue(false);
    await request(app).get('/api/products/8').expect(404);
    await request(app).put('/api/products/8').send(payload).expect(404);
    await request(app).delete('/api/products/8').expect(404);
  });
  test('regresión: SKU duplicado es conflicto 409, sin exponer SQL', async () => {
    service.create.mockRejectedValue({ code: 'ER_DUP_ENTRY', sqlMessage: 'secreto interno' });
    const result = await request(app).post('/api/products').send(payload).expect(409);
    expect(JSON.stringify(result.body)).not.toContain('secreto');
  });
  test('regresión: errores inesperados no filtran información interna', async () => {
    service.list.mockRejectedValue(new Error('clave sensible'));
    const result = await request(app).get('/api/products').expect(500);
    expect(JSON.stringify(result.body)).not.toContain('clave sensible');
  });
  test('responde 404 al usar ruta desconocida', async () => {
    await request(app).get('/api/no-existe').expect(404);
  });
});
