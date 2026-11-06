'use strict';
const pool = require('./db');
const { createProductsService } = require('./services');
const { createApp } = require('./app');
const port = Number(process.env.PORT || 3001);
const app = createApp(createProductsService(pool));
app.listen(port, '0.0.0.0', () => console.log(`Inventario Nova API en puerto ${port}`));
