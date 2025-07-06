const API_URL = "https://sistemaonclicklock.onrender.com/api";

// Clientes

export const fetchClientes = async () => {
  try {
    const response = await fetch(`${API_URL}/clientes`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchClientes:', error);
    throw error;
  }
};

export const fetchCliente = async (id) => {
  const response = await fetch(`${API_URL}/clientes/${id}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const createCliente = async (cliente) => {
  try {
    const formData = new FormData();
    for (const key in cliente) {
      formData.append(key, cliente[key]);
    }
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('Error en createCliente:', error);
    throw error;
  }
};

export const patchCliente = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/clientes/${id}/update`, {
      method: 'PATCH',
      body: data
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to update cliente');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    const formData = new FormData();
    for (const key in clienteData) {
      formData.append(key, clienteData[key]);
    }
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to update cliente');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCliente = async (id) => {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete cliente');
  return await response.json();
};

// Préstamos

export const fetchPrestamos = async () => {
  const response = await fetch(`${API_URL}/prestamos`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const fetchPrestamo = async (id) => {
  const response = await fetch(`${API_URL}/prestamos/${id}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const createPrestamo = async (prestamo) => {
  try {
    const response = await fetch(`${API_URL}/prestamos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prestamo)
    });
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    throw error;
  }
};

export const updatePrestamo = async (id, prestamoData) => {
  try {
    const response = await fetch(`${API_URL}/prestamos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prestamoData)
    });
    if (!response.ok) throw new Error('Failed to update prestamo');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deletePrestamo = async (id) => {
  const response = await fetch(`${API_URL}/prestamos/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete prestamo');
  return await response.json();
};

// Login

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Failed to login');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Imagen

export const downloadImage = async (clienteId) => {
  try {
    const response = await fetch(`${API_URL}/download_image/${clienteId}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    throw error;
  }
};

// Documentos

export const generarPagare = async (data) => {
  try {
    const response = await fetch(`${API_URL}/generar-pagare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to generate pagare');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pagare_${data.id}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    throw error;
  }
};

export const generarAmortizacion = async (data) => {
  try {
    const response = await fetch(`${API_URL}/generar-contrato`, {
      method: 'POST',
      body: data
    });
    if (!response.ok) throw new Error('Failed to generate amortizacion');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amortizacion_${data.get('nombre_completo')}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    throw error;
  }
};

// Usuarios

export const getUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/get_user_by_id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Pagos

export const fetchPagosByPrestamo = async (prestamoId) => {
  try {
    const response = await fetch(`${API_URL}/prestamo/${prestamoId}/pagos`);
    if (!response.ok) throw new Error('Failed to fetch pagos');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const registrarPago = async (pagoId) => {
  try {
    const response = await fetch(`${API_URL}/pago/${pagoId}/registrar`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to register pago');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const desregistrarPago = async (pagoId) => {
  try {
    const response = await fetch(`${API_URL}/pago/${pagoId}/desregistrar`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to deregister pago');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchPagoDetails = async (pagoId) => {
  try {
    const response = await fetch(`${API_URL}/pago/${pagoId}`);
    if (!response.ok) throw new Error('Failed to fetch pago details');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const actualizarEstatusPagos = async (prestamoId) => {
  try {
    const response = await fetch(`${API_URL}/prestamos/${prestamoId}/actualizar-estatus`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Mensajes

export const enviarSmsPrestamo = async ({ mensaje, cliente_id }) => {
  try {
    const response = await fetch(`${API_URL}/prestamos/enviar-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje, cliente_id }),
    });
    if (!response.ok) throw new Error('Failed to send SMS for prestamo');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const cambiarEstadoPrestamo = async (prestamoId, nuevoEstado) => {
  try {
    const response = await fetch(`${API_URL}/prestamos/${prestamoId}/actualizar-estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (!response.ok) throw new Error('Failed to update loan status');
    return await response.json();
  } catch (error) {
    throw error;
  }
};
