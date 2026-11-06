import { useEffect, useMemo, useState } from 'react';
import { Package, Boxes, AlertTriangle, Wallet, Search, Plus, RefreshCw, ShieldCheck, LayoutDashboard, FileCheck2 } from 'lucide-react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { formatCurrency, summarize } from './utils';

const API = '/api/products';
async function callApi(url, options) {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Error HTTP ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}
export default function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const summary = useMemo(() => summarize(products), [products]);
  async function load() {
    setLoading(true);
    try { const data = await callApi(API); setProducts(data.data); setError(''); }
    catch (err) { setError(`${err.message}. Revisa que la API y MySQL estén activos.`); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => products.filter((p) =>
    [p.name, p.sku, p.category].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [products, search]);
  async function save(payload) {
    setBusy(true);
    try {
      await callApi(editing?.id ? `${API}/${editing.id}` : API, { method: editing?.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setEditing(undefined);
      await load();
    } finally { setBusy(false); }
  }
  async function remove(product) {
    if (!window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    try { await callApi(`${API}/${product.id}`, { method: 'DELETE' }); await load(); }
    catch (err) { setError(err.message); }
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><Boxes size={22}/></span><div><strong>NOVA</strong><small>INVENTARIO / SQA</small></div></div>
        <div className="nav-label">ESPACIO DE TRABAJO</div>
        <div className="nav-item active"><LayoutDashboard size={17}/> Panel general</div>
        <div className="nav-item"><Package size={17}/> Productos <span>{summary.total}</span></div>
        <div className="nav-label second">ASEGURAMIENTO</div>
        <div className="nav-item"><ShieldCheck size={17}/> Control de calidad</div>
        <div className="nav-item"><FileCheck2 size={17}/> Reportes SQA</div>
        <div className="sidebar-foot"><span className="foot-status"/> API / MySQL <b>En línea</b><small>Proyecto académico · 2026</small></div>
      </aside>
      <main className="main">
        <header className="topbar"><div className="breadcrumb">Espacio de trabajo <span>/</span> <strong>Dashboard</strong></div><div className="top-user"><span className="live-dot"/> Calidad monitoreada <span className="avatar">AD</span></div></header>
        <div className="page">
          <div className="heading"><div><div className="eyebrow">RESUMEN OPERATIVO <span>•</span> NOVIEMBRE 2026</div><h1>Panel de inventario <span className="wave">✦</span></h1><p>Control de productos y existencias con validaciones integradas.</p></div><button className="btn primary" onClick={() => setEditing(null)}><Plus size={17}/> Nuevo producto</button></div>
          <div className="cards">
            <div className="stat"><div className="stat-top">Total de productos <span className="stat-icon blue"><Package size={20}/></span></div><div className="stat-number">{summary.total}</div><small>Registros en catálogo</small></div>
            <div className="stat"><div className="stat-top">Unidades disponibles <span className="stat-icon violet"><Boxes size={20}/></span></div><div className="stat-number">{summary.units}</div><small>Existencias acumuladas</small></div>
            <div className="stat"><div className="stat-top">Productos por reponer <span className="stat-icon amber"><AlertTriangle size={20}/></span></div><div className="stat-number">{summary.low}</div><small>Existencia menor o igual a 5</small></div>
            <div className="stat"><div className="stat-top">Valor del inventario <span className="stat-icon green"><Wallet size={20}/></span></div><div className="stat-number money">{formatCurrency(summary.value)}</div><small>Precio × existencia</small></div>
          </div>
          <section className="catalog"><div className="catalog-head"><div><div className="eyebrow">ADMINISTRACIÓN</div><h2>Catálogo de productos</h2><p>Consulta, edita y administra el inventario desde un mismo lugar.</p></div><button className="btn secondary" onClick={load}><RefreshCw size={15}/> Actualizar</button></div><div className="toolbar"><label className="search"><Search size={18}/><input aria-label="Buscar productos" placeholder="Buscar por nombre, SKU o categoría..." value={search} onChange={(e) => setSearch(e.target.value)}/></label><span className="results">{filtered.length} resultados</span></div>
            {error && <p className="notice" role="alert">{error}</p>}
            {loading ? <div className="empty">Cargando inventario...</div> : <ProductTable products={filtered} onEdit={setEditing} onRemove={remove}/>}
          </section>
          <footer className="bottom"><span>INVENTARIO NOVA · Sistema de gestión académico</span><span>React + Express + MySQL · CI/CD + SQA</span></footer>
        </div>
      </main>
      {editing !== undefined && <ProductForm initial={editing} onCancel={() => setEditing(undefined)} onSave={save} busy={busy}/>}
    </div>
  );
}
