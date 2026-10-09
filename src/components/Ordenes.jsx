import { useMemo, useState } from 'react';
import { quetzales } from './Servicios.jsx';

const ETIQUETA = { pendiente: 'Pendiente', en_proceso: 'En proceso', finalizada: 'Finalizada' };

export default function Ordenes({ ordenes, vehiculos, clientes, servicios, onCrear, onAvanzar, onEliminar }) {
  const [vehiculoId, setVehiculoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [seleccion, setSeleccion] = useState([]); // ids de servicios marcados
  const [filtro, setFiltro] = useState('todas');

  const alternar = (id) =>
    setSeleccion(seleccion.includes(id) ? seleccion.filter((x) => x !== id) : [...seleccion, id]);

  // Valor derivado: el total de la nueva orden se calcula, no se guarda
  const totalNueva = useMemo(
    () => servicios.filter((s) => seleccion.includes(s.id)).reduce((suma, s) => suma + s.precio, 0),
    [servicios, seleccion]
  );

  const infoVehiculo = (id) => {
    const v = vehiculos.find((x) => x.id === id);
    if (!v) return null;
    const c = clientes.find((x) => x.id === v.clienteId);
    return { texto: `${v.placa} - ${v.marca} ${v.modelo}`, cliente: c?.nombre ?? '—' };
  };

  const enviar = (e) => {
    e.preventDefault();
    if (!vehiculoId || seleccion.length === 0) return;
    onCrear({ vehiculoId: Number(vehiculoId), descripcion, servicioIds: seleccion });
    setVehiculoId('');
    setDescripcion('');
    setSeleccion([]);
  };

  const visibles = ordenes.filter((o) => filtro === 'todas' || o.estado === filtro);

  return (
    <>
      <div className="card">
        <h2>Nueva orden de trabajo</h2>
        {vehiculos.length === 0 ? (
          <p className="empty">Primero registra un cliente y un vehículo.</p>
        ) : (
          <form onSubmit={enviar}>
            <label>Vehículo
              <select value={vehiculoId} onChange={(e) => setVehiculoId(e.target.value)} required>
                <option value="">Selecciona...</option>
                {vehiculos.map((v) => {
                  const i = infoVehiculo(v.id);
                  return <option key={v.id} value={v.id}>{i.texto} ({i.cliente})</option>;
                })}
              </select>
            </label>
            <label className="grow">Descripción
              <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Ruido al frenar" />
            </label>
            <div className="full">
              <div className="sub">Servicios</div>
              <div className="checks">
                {servicios.map((s) => (
                  <label key={s.id} className="check">
                    <input type="checkbox" checked={seleccion.includes(s.id)} onChange={() => alternar(s.id)} />
                    {s.nombre} ({quetzales(s.precio)})
                  </label>
                ))}
              </div>
            </div>
            <div className="full total-previo">Total: <strong>{quetzales(totalNueva)}</strong></div>
            <button className="btn" disabled={seleccion.length === 0}>Crear orden</button>
          </form>
        )}
      </div>

      <div className="card">
        <div className="fila-titulo">
          <h2>Órdenes</h2>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_proceso">En proceso</option>
            <option value="finalizada">Finalizadas</option>
          </select>
        </div>
        {visibles.length === 0 ? (
          <p className="empty">No hay órdenes para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Fecha</th><th>Vehículo / Cliente</th><th>Servicios</th><th>Total</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {visibles.map((o) => {
                const i = infoVehiculo(o.vehiculoId);
                const total = o.servicios.reduce((suma, s) => suma + s.precio, 0);
                return (
                  <tr key={o.id}>
                    <td>{o.fecha}</td>
                    <td>
                      {i?.texto}<br /><small>{i?.cliente}</small>
                      {o.descripcion && <><br /><small>{o.descripcion}</small></>}
                    </td>
                    <td>{o.servicios.map((s, k) => <div key={k}>{s.nombre}</div>)}</td>
                    <td className="total">{quetzales(total)}</td>
                    <td><span className={`badge ${o.estado}`}>{ETIQUETA[o.estado]}</span></td>
                    <td>
                      {o.estado !== 'finalizada' && (
                        <button className="btn sm" onClick={() => onAvanzar(o.id)}>Avanzar</button>
                      )}{' '}
                      <button className="btn sm del" onClick={() => onEliminar(o.id)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
