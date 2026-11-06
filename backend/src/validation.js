'use strict';

/** Reglas de negocio puras, sin dependencia de la base de datos. */
function validateProduct(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, errors: { body: 'Se requiere un objeto JSON.' } };
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const sku = typeof input.sku === 'string' ? input.sku.trim().toUpperCase() : '';
  const category = typeof input.category === 'string' ? input.category.trim() : '';
  const price = input.price;
  const stock = input.stock;

  if (name.length < 3 || name.length > 120) errors.name = 'Nombre entre 3 y 120 caracteres.';
  if (!/^[A-Z0-9-]{4,24}$/.test(sku)) errors.sku = 'SKU de 4 a 24 caracteres alfanuméricos.';
  if (category.length < 3 || category.length > 60) errors.category = 'Categoría entre 3 y 60 caracteres.';
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0 || price > 1000000) {
    errors.price = 'Precio numérico entre 0 y 1000000.';
  }
  if (!Number.isInteger(stock) || stock < 0 || stock > 1000000) {
    errors.stock = 'Existencia entera entre 0 y 1000000.';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: { name, sku, category, price, stock },
  };
}

function parsePositiveId(raw) {
  const value = Number(raw);
  return Number.isSafeInteger(value) && value > 0 && String(value) === String(raw)
    ? value
    : null;
}

function stockStatus(stock) {
  if (stock === 0) return 'Agotado';
  if (stock <= 5) return 'Bajo';
  return 'Disponible';
}

module.exports = { validateProduct, parsePositiveId, stockStatus };
