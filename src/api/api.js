const API_URL = 'https://gestionprestamos-server.onrender.com/api';
//const API_URL = 'http://localhost:8000/api';


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

    // Devolvemos tanto los datos como el estado de la respuesta
    return { data, status: response.status };
  } catch (error) {
    console.error('Error en createCliente:', error);
    throw error;
  }
};

export const patchCliente = async (id, data) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_URL}/clientes/${id}/update/`, {
      method: 'PATCH',
      body: data
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en patchCliente:', errorData);
      throw new Error('Failed to update cliente');
    }
    
    const responseData = await response.json();
    console.log('Respuesta de patchCliente:', JSON.stringify(responseData));
    return responseData;
    
  } catch (error) {
    console.error('Error en patchCliente:', error);
    throw error;
  }
};



export const updateCliente = async (id, clienteData) => {
  try {
    const formData = new FormData();
    for (const key in clienteData) {
      formData.append(key, clienteData[key]);
    }
    const response = await fetch(`${API_URL}/clientes/${id}/`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error updating cliente:', errorData);
      throw new Error('Failed to update cliente');
    }
    return await response.json();
  } catch (error) {
    console.error('Unexpected error updating cliente:', error);
    throw error;
  }
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

    // Devolvemos tanto los datos como el estado de la respuesta
    return { data, status: response.status };
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
    console.log(`Iniciando descarga de imagen para el cliente ID: ${clienteId}`);

    const response = await fetch(`${API_URL}/download_image/${clienteId}/`);
    console.log(`Respuesta de la solicitud de descarga:`, response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta de la red:', errorText);
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    console.log('Blob de la imagen recibida:', blob);

    const url = window.URL.createObjectURL(blob);
    console.log('URL creada para el blob:', url);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg'; // O el nombre de archivo que desees
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log('Imagen descargada exitosamente.');
  } catch (error) {
    console.error('Error en downloadImage:', error);
    throw error;
  }
};

// Generar Pagaré
export const generarPagare = async (data) => {
  try {
      const response = await fetch(`${API_URL}/generar-pagare/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Failed to generate pagare');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagare_${data.id}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
  } catch (error) {
      console.error('Error en generarPagare:', error);
      throw error;
  }
};


// Generar Tabla de Amortización
// Generar Tabla de Amortización
export const generarAmortizacion = async (data) => {
  console.log('Iniciando generación de amortización...');

  // Mostrar los datos que se están enviando
  for (let pair of data.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  // Verificación adicional del campo 'fecha_inicio'
  const fechaInicio = data.get('fecha_inicio');
  console.log('Valor de fecha_inicio:', fechaInicio);

  try {
      const response = await fetch(`${API_URL}/generar-contrato/`, {
          method: 'POST',
          body: data, // Usamos FormData directamente
      });

      console.log('Respuesta del servidor recibida:', response);

      if (!response.ok) {
          console.error('Error en la respuesta del servidor:', response.status, response.statusText);
          throw new Error('Failed to generate amortizacion');
      }

      const blob = await response.blob();
      console.log('Blob creado:', blob);

      const url = window.URL.createObjectURL(blob);
      console.log('URL de Blob:', url);

      const a = document.createElement('a');
      a.href = url;
      a.download = `amortizacion_${data.get('nombre_completo')}.docx`; // Accedemos al nombre desde FormData
      document.body.appendChild(a);
      a.click();
      console.log('Descarga iniciada para:', a.download);

      a.remove();
  } catch (error) {
      console.error('Error en generarAmortizacion:', error);
      throw error;
  }
};


// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/get_user_by_id/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    console.log('Respuesta de getUserById:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error en getUserById:', error);
    throw error;
  }
};
