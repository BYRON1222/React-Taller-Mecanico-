import { useState } from 'react';

const VACIO = { id: null, nombre: '', telefono: '', email: '' };

export default function Clientes({ clientes, onGuardar, onEliminar }) {
  // Formulario controlado: el valor de cada input vive en el estado
  const [form, setForm] = useState(VACIO);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onGuardar({ ...form, nombre: form.nombre.trim() });
    setForm(VACIO);
  };

  return (
    <>
      <div className="card">
        <h2>{form.id ? 'Editar cliente' : 'Nuevo cliente'}</h2>
        <form onSubmit={enviar}>
          <label>Nombre
            <input name="nombre" value={form.nombre} onChange={cambiar} required />
          </label>
          <label>Teléfono
            <input name="telefono" value={form.telefono} onChange={cambiar} />
          </label>
          <label>Email
            <input name="email" type="email" value={form.email} onChange={cambiar} />
          </label>
          <button className="btn">Guardar</button>
          {form.id && (
            <button type="button" className="btn sec" onClick={() => setForm(VACIO)}>Cancelar</button>
          )}
        </form>
      </div>

      <div className="card">
        <h2>Clientes</h2>
        {clientes.length === 0 ? (
          <p className="empty">Sin clientes todavía.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th></th></tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.telefono}</td>
                  <td>{c.email}</td>
                  <td>
                    <button className="btn sm sec" onClick={() => setForm(c)}>Editar</button>{' '}
                    <button
                      className="btn sm del"
                      onClick={() =>
                        window.confirm('¿Eliminar cliente junto con sus vehículos y órdenes?') && onEliminar(c.id)
                      }
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
