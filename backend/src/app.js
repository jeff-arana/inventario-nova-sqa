'use strict';
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { validateProduct, parsePositiveId, stockStatus } = require('./validation');

function createApp(productsService) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json({ limit: '32kb' }));

  const asyncRoute = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res)).catch(next);
  };
  const decorate = (product) => ({ ...product, status: stockStatus(product.stock) });

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Inventario Nova' }));

  app.get('/api/products', asyncRoute(async (req, res) => {
    const rows = await productsService.list(req.query.search || '');
    res.json({ data: rows.map(decorate), count: rows.length });
  }));

  app.get('/api/products/:id', asyncRoute(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido.' });
    const product = await productsService.find(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    return res.json({ data: decorate(product) });
  }));

  app.post('/api/products', asyncRoute(async (req, res) => {
    const checked = validateProduct(req.body);
    if (!checked.valid) return res.status(422).json({ error: 'Datos inválidos.', fields: checked.errors });
    const created = await productsService.create(checked.value);
    return res.status(201).json({ data: decorate(created) });
  }));

  app.put('/api/products/:id', asyncRoute(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido.' });
    const checked = validateProduct(req.body);
    if (!checked.valid) return res.status(422).json({ error: 'Datos inválidos.', fields: checked.errors });
    const updated = await productsService.update(id, checked.value);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado.' });
    return res.json({ data: decorate(updated) });
  }));

  app.delete('/api/products/:id', asyncRoute(async (req, res) => {
    const id = parsePositiveId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID inválido.' });
    const removed = await productsService.remove(id);
    if (!removed) return res.status(404).json({ error: 'Producto no encontrado.' });
    return res.status(204).send();
  }));

  app.use((req, res) => res.status(404).json({ error: `Ruta no encontrada: ${req.path}` }));
  app.use((error, _req, res, _next) => {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El SKU ya existe.' });
    if (error instanceof SyntaxError && error.status === 400) {
      return res.status(400).json({ error: 'JSON inválido.' });
    }
    if (process.env.NODE_ENV !== 'test') console.error(error);
    return res.status(500).json({ error: 'No fue posible completar la operación.' });
  });
  return app;
}

module.exports = { createApp };
