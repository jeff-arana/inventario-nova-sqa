import test from 'node:test';
import assert from 'node:assert/strict';
import validation from '../src/validation.js';

const good = { sku: 'AB-123', name: 'Laptop Lenovo', category: 'Computación', price: 1500, stock: 5 };
test('núcleo: valida producto completo', () => assert.equal(validation.validateProduct(good).valid, true));
test('núcleo: rechaza precio negativo', () => assert.ok(validation.validateProduct({ ...good, price: -1 }).errors.price));
test('núcleo: rechaza existencia fraccionaria', () => assert.ok(validation.validateProduct({ ...good, stock: 1.1 }).errors.stock));
test('núcleo: normaliza SKU', () => assert.equal(validation.validateProduct({ ...good, sku: 'ab-123' }).value.sku, 'AB-123'));
test('núcleo: estado agotado', () => assert.equal(validation.stockStatus(0), 'Agotado'));
test('núcleo: estado bajo', () => assert.equal(validation.stockStatus(3), 'Bajo'));
test('núcleo: estado disponible', () => assert.equal(validation.stockStatus(12), 'Disponible'));
test('núcleo: ID seguro', () => assert.equal(validation.parsePositiveId('8'), 8));
test('núcleo: ID inválido', () => assert.equal(validation.parsePositiveId('8.1'), null));
