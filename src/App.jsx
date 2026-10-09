import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage.js';
import Clientes from './components/Clientes.jsx';
import Vehiculos from './components/Vehiculos.jsx';
import Servicios from './components/Servicios.jsx';
import Ordenes from './components/Ordenes.jsx';

const SERVICIOS_INICIALES = [
  { id: 1, nombre: 'Cambio de aceite', precio: 150 },
  { id: 2, nombre: 'Cambio de frenos', precio: 400 },
  { id: 3, nombre: 'Alineación y balanceo', precio: 250 },
  { id: 4, nombre: 'Revisión eléctrica', precio: 200 },
  { id: 5, nombre: 'Cambio de batería', precio: 600 },
];

const TABS = [
  ['ordenes', 'Órdenes'],
  ['clientes', 'Clientes'],
  ['vehiculos', 'Vehículos'],
  ['servicios', 'Servicios'],
];

// Genera un id único simple
const nuevoId = () => Date.now() + Math.floor(Math.random() * 1000);

export default function App() {
  // El estado vive aquí (el componente padre) y se reparte a los hijos por props
  const [tab, setTab] = useState('ordenes');
  const [clientes, setClientes] = useLocalStorage('taller_clientes', []);
  const [vehiculos, setVehiculos] = useLocalStorage('taller_vehiculos', []);
  const [servicios, setServicios] = useLocalStorage('taller_servicios', SERVICIOS_INICIALES);
  const [ordenes, setOrdenes] = useLocalStorage('taller_ordenes', []);
  const [aviso, setAviso] = useState(null);

  const mostrarAviso = (texto, tipo = 'ok') => {
    setAviso({ texto, tipo });
    setTimeout(() => setAviso(null), 2500);
  };

  // ---------- Clientes ----------
  const guardarCliente = (datos) => {
    if (datos.id) {
      setClientes(clientes.map((c) => (c.id === datos.id ? datos : c)));
    } else {
      setClientes([{ ...datos, id: nuevoId() }, ...clientes]);
    }
    mostrarAviso('Cliente guardado');
  };

  // Al borrar un cliente se borran en cascada sus vehículos y las órdenes de esos vehículos
  const eliminarCliente = (id) => {
    const idsVehiculos = vehiculos.filter((v) => v.clienteId === id).map((v) => v.id);
    setClientes(clientes.filter((c) => c.id !== id));
    setVehiculos(vehiculos.filter((v) => v.clienteId !== id));
    setOrdenes(ordenes.filter((o) => !idsVehiculos.includes(o.vehiculoId)));
    mostrarAviso('Cliente eliminado');
  };

  // ---------- Vehículos ----------
  const guardarVehiculo = (datos) => {
    const placa = datos.placa.trim().toUpperCase();
    if (vehiculos.some((v) => v.placa === placa)) {
      mostrarAviso('Ya existe un vehículo con esa placa', 'err');
      return false;
    }
    setVehiculos([{ ...datos, placa, id: nuevoId() }, ...vehiculos]);
    mostrarAviso('Vehículo guardado');
    return true;
  };

  const eliminarVehiculo = (id) => {
    setVehiculos(vehiculos.filter((v) => v.id !== id));
    setOrdenes(ordenes.filter((o) => o.vehiculoId !== id));
    mostrarAviso('Vehículo eliminado');
  };

  // ---------- Servicios ----------
  const guardarServicio = (datos) => {
    if (servicios.some((s) => s.nombre.toLowerCase() === datos.nombre.trim().toLowerCase())) {
      mostrarAviso('Ese servicio ya existe', 'err');
      return false;
    }
    setServicios([...servicios, { ...datos, nombre: datos.nombre.trim(), id: nuevoId() }]);
    mostrarAviso('Servicio guardado');
    return true;
  };

  const eliminarServicio = (id) => {
    setServicios(servicios.filter((s) => s.id !== id));
    mostrarAviso('Servicio eliminado');
  };

  // ---------- Órdenes ----------
  const crearOrden = ({ vehiculoId, descripcion, servicioIds }) => {
    // Se copia nombre y precio: si el catálogo cambia, la orden conserva su histórico
    const detalle = servicios
      .filter((s) => servicioIds.includes(s.id))
      .map((s) => ({ nombre: s.nombre, precio: s.precio }));
    setOrdenes([
      {
        id: nuevoId(),
        vehiculoId,
        descripcion,
        servicios: detalle,
        estado: 'pendiente',
        fecha: new Date().toLocaleString(),
      },
      ...ordenes,
    ]);
    mostrarAviso('Orden creada');
  };

  // Máquina de estados: pendiente -> en_proceso -> finalizada
  const SIGUIENTE = { pendiente: 'en_proceso', en_proceso: 'finalizada' };
  const avanzarOrden = (id) => {
    setOrdenes(
      ordenes.map((o) => (o.id === id && SIGUIENTE[o.estado] ? { ...o, estado: SIGUIENTE[o.estado] } : o))
    );
    mostrarAviso('Estado actualizado');
  };

  const eliminarOrden = (id) => {
    setOrdenes(ordenes.filter((o) => o.id !== id));
    mostrarAviso('Orden eliminada');
  };

  return (
    <>
      <header>
        <h1>🔧 Taller Mecánico</h1>
        <nav>
          {TABS.map(([clave, texto]) => (
            <button key={clave} className={tab === clave ? 'active' : ''} onClick={() => setTab(clave)}>
              {texto}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'ordenes' && (
          <Ordenes
            ordenes={ordenes}
            vehiculos={vehiculos}
            clientes={clientes}
            servicios={servicios}
            onCrear={crearOrden}
            onAvanzar={avanzarOrden}
            onEliminar={eliminarOrden}
          />
        )}
        {tab === 'clientes' && (
          <Clientes clientes={clientes} onGuardar={guardarCliente} onEliminar={eliminarCliente} />
        )}
        {tab === 'vehiculos' && (
          <Vehiculos
            vehiculos={vehiculos}
            clientes={clientes}
            onGuardar={guardarVehiculo}
            onEliminar={eliminarVehiculo}
          />
        )}
        {tab === 'servicios' && (
          <Servicios servicios={servicios} onGuardar={guardarServicio} onEliminar={eliminarServicio} />
        )}
      </main>

      {aviso && <div className={`aviso ${aviso.tipo}`}>{aviso.texto}</div>}
    </>
  );
}
