/** Prueba real de integración con MySQL. Corre en CI, se omite en pruebas locales sin DB. */
const request = require('supertest');
const { createApp } = require('../src/app');
const { createProductsService } = require('../src/services');
const enabled = process.env.DB_INTEGRATION === '1';

(enabled ? describe : describe.skip)('SQA | integración completa API / MySQL', () => {
  let pool;
  let app;
  let id;
  const sku = `IT-${process.pid}-${Date.now()}`;
  beforeAll(() => {
    pool = require('../src/db');
    app = createApp(createProductsService(pool));
  });
  afterAll(async () => {
    if (id) await pool.execute('DELETE FROM products WHERE id=?', [id]);
    if (pool) await pool.end();
  });
  test('creación, lectura, actualización, eliminación y consulta de regresión', async () => {
    const original = { sku, name: 'Registro de integración', category: 'Pruebas', price: 100.50, stock: 2 };
    const created = await request(app).post('/api/products').send(original).expect(201);
    id = created.body.data.id;
    expect(id).toBeGreaterThan(0);
    const read = await request(app).get(`/api/products/${id}`).expect(200);
    expect(read.body.data.status).toBe('Bajo');
    await request(app).put(`/api/products/${id}`).send({ ...original, stock: 10 }).expect(200);
    const list = await request(app).get(`/api/products?search=${sku}`).expect(200);
    expect(list.body.data[0].stock).toBe(10);
    await request(app).delete(`/api/products/${id}`).expect(204);
    id = null;
    await request(app).get(`/api/products/${read.body.data.id}`).expect(404);
  });
});
