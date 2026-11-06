export const emptyProduct = { sku: '', name: '', category: '', price: '', stock: '' };
export function formatCurrency(amount) {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', minimumFractionDigits: 2 }).format(Number(amount) || 0);
}
export function getStatus(stock) {
  if (Number(stock) === 0) return 'Agotado';
  if (Number(stock) <= 5) return 'Bajo';
  return 'Disponible';
}
export function productToPayload(form) {
  return { ...form, price: Number(form.price), stock: Number(form.stock) };
}
export function summarize(products) {
  return {
    total: products.length,
    units: products.reduce((acc, product) => acc + Number(product.stock), 0),
    low: products.filter((product) => Number(product.stock) <= 5).length,
    value: products.reduce((acc, product) => acc + Number(product.stock) * Number(product.price), 0),
  };
}
