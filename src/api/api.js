const API_URL = 'http://localhost:8000/api';

// Clientes

export const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/`);
      const data = await response.json();
      console.log('Respuesta de fetchClientes:', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error en fetchClientes:', error);
      throw error;
    }
  };

export const fetchCliente = async (id) => {
  const response = await fetch(`${API_URL}/clientes/${id}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createCliente = async (cliente) => {
    try {
      const formData = new FormData();
      for (const key in cliente) {
        formData.append(key, cliente[key]);
      }
      const response = await fetch(`${API_URL}/clientes/`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Respuesta de createCliente:', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error en createCliente:', error);
      throw error;
    }
  };

export const updateCliente = async (id, clienteData) => {
  const response = await fetch(`${API_URL}/clientes/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clienteData)
  });
  if (!response.ok) {
    throw new Error('Failed to update cliente');
  }
  return await response.json();
};

export const deleteCliente = async (id) => {
  const response = await fetch(`${API_URL}/clientes/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete cliente');
  }
  return await response.json();
};

// Préstamos
export const fetchPrestamos = async () => {
  const response = await fetch(`${API_URL}/prestamos/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const fetchPrestamo = async (id) => {
  const response = await fetch(`${API_URL}/prestamos/${id}/`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
};

export const createPrestamo = async (prestamo) => {
    try {
      const response = await fetch(`${API_URL}/prestamos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prestamo)
      });
      const data = await response.json();
      console.log('Respuesta de createPrestamo:', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error en createPrestamo:', error);
      throw error;
    }
  };
export const updatePrestamo = async (id, prestamoData) => {
  const response = await fetch(`${API_URL}/prestamos/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prestamoData)
  });
  if (!response.ok) {
    throw new Error('Failed to update prestamo');
  }
  return await response.json();
};

export const deletePrestamo = async (id) => {
  const response = await fetch(`${API_URL}/prestamos/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete prestamo');
  }
  return await response.json();
};
