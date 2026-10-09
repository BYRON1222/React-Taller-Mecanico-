import { useState } from 'react';

const VACIO = { clienteId: '', placa: '', marca: '', modelo: '', anio: '' };

export default function Vehiculos({ vehiculos, clientes, onGuardar, onEliminar }) {
  const [form, setForm] = useState(VACIO);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? '—';

  const enviar = (e) => {
    e.preventDefault();
    const ok = onGuardar({ ...form, clienteId: Number(form.clienteId) });
    if (ok) setForm(VACIO);
  };

  return (
    <>
      <div className="card">
        <h2>Nuevo vehículo</h2>
        {clientes.length === 0 ? (
          <p className="empty">Primero registra un cliente en la pestaña Clientes.</p>
        ) : (
          <form onSubmit={enviar}>
            <label>Cliente
              <select name="clienteId" value={form.clienteId} onChange={cambiar} required>
                <option value="">Selecciona...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </label>
            <label>Placa <input name="placa" value={form.placa} onChange={cambiar} required /></label>
            <label>Marca <input name="marca" value={form.marca} onChange={cambiar} required /></label>
            <label>Modelo <input name="modelo" value={form.modelo} onChange={cambiar} required /></label>
            <label>Año
              <input name="anio" type="number" min="1950" max="2100" value={form.anio} onChange={cambiar} />
            </label>
            <button className="btn">Guardar</button>
          </form>
        )}
      </div>

      <div className="card">
        <h2>Vehículos</h2>
        {vehiculos.length === 0 ? (
          <p className="empty">Sin vehículos todavía.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Placa</th><th>Vehículo</th><th>Año</th><th>Cliente</th><th></th></tr>
            </thead>
            <tbody>
              {vehiculos.map((v) => (
                <tr key={v.id}>
                  <td>{v.placa}</td>
                  <td>{v.marca} {v.modelo}</td>
                  <td>{v.anio}</td>
                  <td>{nombreCliente(v.clienteId)}</td>
                  <td>
                    <button
                      className="btn sm del"
                      onClick={() => window.confirm('¿Eliminar vehículo y sus órdenes?') && onEliminar(v.id)}
                    >
                      Eliminar
                    </button>
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
