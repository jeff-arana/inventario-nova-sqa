import { formatCurrency, getStatus } from './utils';
export default function ProductTable({ products, onEdit, onRemove }) {
  if (products.length === 0) return <div className="empty">No hay productos para mostrar.</div>;
  return (
    <div className="table-wrap"><table><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Existencia</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
      {products.map((p) => <tr key={p.id}><td className="product-cell"><span className="product-icon">◈</span><strong>{p.name}</strong></td><td className="mono">{p.sku}</td><td>{p.category}</td><td className="bold">{formatCurrency(p.price)}</td><td>{p.stock} unidades</td><td><span className={`pill ${getStatus(p.stock).toLowerCase()}`}>{getStatus(p.stock)}</span></td><td><div className="actions"><button onClick={() => onEdit(p)} aria-label={`Editar ${p.name}`}>Editar</button><button className="danger" onClick={() => onRemove(p)} aria-label={`Eliminar ${p.name}`}>Eliminar</button></div></td></tr>)}
    </tbody></table></div>
  );
}
