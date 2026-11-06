'use strict';

function createProductsService(pool) {
  return {
    async list(search = '') {
      const term = `%${String(search).trim().slice(0, 100)}%`;
      const [rows] = await pool.execute(
        `SELECT id, sku, name, category, price, stock, created_at, updated_at
         FROM products WHERE name LIKE ? OR sku LIKE ? OR category LIKE ?
         ORDER BY id DESC`,
        [term, term, term],
      );
      return rows;
    },
    async find(id) {
      const [rows] = await pool.execute(
        'SELECT id, sku, name, category, price, stock, created_at, updated_at FROM products WHERE id=?',
        [id],
      );
      return rows[0] || null;
    },
    async create(product) {
      const [result] = await pool.execute(
        'INSERT INTO products(sku,name,category,price,stock) VALUES(?,?,?,?,?)',
        [product.sku, product.name, product.category, product.price, product.stock],
      );
      return this.find(result.insertId);
    },
    async update(id, product) {
      const [result] = await pool.execute(
        'UPDATE products SET sku=?,name=?,category=?,price=?,stock=? WHERE id=?',
        [product.sku, product.name, product.category, product.price, product.stock, id],
      );
      return result.affectedRows ? this.find(id) : null;
    },
    async remove(id) {
      const [result] = await pool.execute('DELETE FROM products WHERE id=?', [id]);
      return result.affectedRows > 0;
    },
  };
}

module.exports = { createProductsService };
