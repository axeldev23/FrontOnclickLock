import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ClientesAdmin = () => {
  const { token, user } = useContext(AuthContext);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.is_staff) {
      fetch(`${import.meta.env.VITE_API_URL}/clientes/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setClientes(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error al obtener clientes:', err);
          setLoading(false);
        });
    }
  }, [token, user]);

  if (!user?.is_staff) return <p>No tienes permiso para ver esta página.</p>;
  if (loading) return <p>Cargando clientes...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Clientes registrados</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Domicilio</th>
            <th className="border px-2 py-1">Teléfono</th>
            <th className="border px-2 py-1">CURP</th>
            {/* Agrega más columnas si lo deseas */}
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td className="border px-2 py-1">{cliente.id}</td>
              <td className="border px-2 py-1">{cliente.nombre_completo}</td>
              <td className="border px-2 py-1">{cliente.domicilio_actual}</td>
              <td className="border px-2 py-1">{cliente.numero_telefono}</td>
              <td className="border px-2 py-1">{cliente.curp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesAdmin;
