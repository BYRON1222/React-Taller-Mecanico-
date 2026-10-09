import { useState } from 'react';

export const quetzales = (n) => 'Q' + Number(n).toFixed(2);

export default function Servicios({ servicios, onGuardar, onEliminar }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    const ok = onGuardar({ nombre, precio: Number(precio) });
    if (ok) {
      setNombre('');
      setPrecio('');
    }
  };

  return (
    <>
      <div className="card">
        <h2>Nuevo servicio</h2>
        <form onSubmit={enviar}>
          <label>Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label>Precio (Q)
            <input type="number" min="0" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          </label>
          <button className="btn">Guardar</button>
        </form>
      </div>

      <div className="card">
        <h2>Catálogo de servicios</h2>
        {servicios.length === 0 ? (
          <p className="empty">Sin servicios todavía.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Servicio</th><th>Precio</th><th></th></tr>
            </thead>
            <tbody>
              {servicios.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>{quetzales(s.precio)}</td>
                  <td>
                    <button className="btn sm del" onClick={() => onEliminar(s.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
