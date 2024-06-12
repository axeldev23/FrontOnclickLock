const API_URL = 'https://gestionprestamos-server.onrender.com/api';

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
    console.log(`Intentando actualizar prestamo con ID: ${id}`);
    console.log('Datos del prestamo a actualizar:', prestamoData);
    
    try {
      const response = await fetch(`${API_URL}/prestamos/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prestamoData)
      });
  
      console.log('Respuesta de la actualización:', response);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la actualización:', errorText);
        throw new Error('Failed to update prestamo');
      }
  
      const data = await response.json();
      console.log('Datos actualizados del prestamo:', data);
      return data;
    } catch (error) {
      console.error('Error en updatePrestamo:', error);
      throw error;
    }
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

// Login
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to login');
    }
    const data = await response.json();
    console.log('Respuesta de login:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Descargar imagen
export const downloadImage = async (clienteId) => {
  try {
    const response = await fetch(`${API_URL}/download_image/${clienteId}/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg'; // O el nombre de archivo que desees
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Error en downloadImage:', error);
    throw error;
  }
};
