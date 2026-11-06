import { useEffect, useState } from 'react';
import { emptyProduct, productToPayload } from './utils';

export default function ProductForm({ initial, onCancel, onSave, busy = false }) {
  const [form, setForm] = useState(initial || emptyProduct);
  const [error, setError] = useState('');
  useEffect(() => setForm(initial || emptyProduct), [initial]);
  async function submit(event) {
    event.preventDefault();
    setError('');
    const payload = productToPayload(form);
    if (form.name.trim().length < 3 || !/^[A-Za-z0-9-]{4,24}$/.test(form.sku)) {
      setError('Verifica el nombre (mínimo 3 letras) y el SKU (4 a 24 caracteres).');
      return;
    }
    if (!form.category.trim() || form.price === '' || form.stock === '' || payload.price < 0 || !Number.isInteger(payload.stock) || payload.stock < 0) {
      setError('Completa categoría, precio válido y existencia entera no negativa.');
      return;
    }
    try { await onSave(payload); } catch (err) { setError(err.message || 'No fue posible guardar.'); }
  }
  return (
    <div className="overlay" role="presentation">
      <section className="modal" aria-label="Formulario de producto">
        <div className="modal-head"><div><span className="eyebrow">CATÁLOGO / PRODUCTOS</span><h2>{initial ? 'Editar producto' : 'Nuevo producto'}</h2></div><button className="iconbtn" onClick={onCancel} aria-label="Cerrar formulario">✕</button></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>SKU<input name="sku" placeholder="TEC-013" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} required /></label>
            <label>Categoría<input name="category" placeholder="Accesorios" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
            <label className="wide">Nombre del producto<input name="name" placeholder="Ej. Audífonos inalámbricos" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Precio (Q)<input name="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
            <label>Existencias<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button type="button" className="btn secondary" onClick={onCancel}>Cancelar</button><button className="btn primary" disabled={busy} type="submit">{busy ? 'Guardando...' : 'Guardar producto'}</button></div>
        </form>
      </section>
    </div>
  );
}
