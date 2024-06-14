import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCliente, patchCliente } from '../api/api';
import { toast } from 'react-toastify';
import { Card, Input, Button, Typography, Spinner } from '@material-tailwind/react';  // Asegúrate de tener Spinner o utiliza otro componente de carga.
import { PhotoIcon, XMarkIcon } from '@heroicons/react/20/solid';

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalCliente, setOriginalCliente] = useState({});
  const [cliente, setCliente] = useState({
    nombre_completo: '',
    clave_elector: '',
    fecha_nacimiento: '',
    domicilio_actual: '',
    correo_electronico: '',
    numero_telefono: '',
    foto_identificacion: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCliente(id);
        setOriginalCliente(data);
        setCliente(data);
        if (data.foto_identificacion) {
          setImagePreview(data.foto_identificacion);
        }
      } catch (error) {
        console.error('Error fetching cliente:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCliente((prevState) => ({
      ...prevState,
      foto_identificacion: file,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCliente((prevState) => ({
      ...prevState,
      foto_identificacion: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    
    // Agregar al formData solo los campos que han cambiado
    for (const key in cliente) {
      if (cliente[key] !== originalCliente[key]) {
        if (key === 'foto_identificacion' && cliente[key] === null) {
          formData.append(key, '');
        } else {
          formData.append(key, cliente[key]);
        }
      }
    }

    try {
      await patchCliente(id, formData);
      toast.success('Cliente actualizado con éxito');
      navigate('/administrar-creditos');
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      toast.error('Error actualizando cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full px-4 md:px-8 lg:px-16">
      <form onSubmit={handleSubmit} className="dark:shadow-custom shadow-2xl mt-5 mb-12 max-w-xl rounded-xl p-5 px-12 w-full max-w-4xl">
        <div className="space-y-10">
          <h1 className="text-xl w-full md:w-96 text-left mt-4 font-semibold">Editar Cliente</h1>
          <Input
            label="Nombre Completo"
            name="nombre_completo"
            value={cliente.nombre_completo}
            onChange={handleChange}
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
            required
          />
          <Input
            label="Clave Elector"
            name="clave_elector"
            value={cliente.clave_elector.toUpperCase()}
            onChange={handleChange}
            required
            maxLength={18}
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
          />
          <Input
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={cliente.fecha_nacimiento}
            onChange={handleChange}
            required
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
          />
          <Input
            label="Domicilio Actual"
            name="domicilio_actual"
            value={cliente.domicilio_actual}
            onChange={handleChange}
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
            required
          />
          <Input
            label="Correo Electrónico"
            name="correo_electronico"
            type="email"
            value={cliente.correo_electronico}
            onChange={handleChange}
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
          />
          <Input
            label="Número de Teléfono"
            name="numero_telefono"
            type="tel"
            pattern="[0-9]{10}"
            value={cliente.numero_telefono}
            onChange={handleChange}
            required
            color={isDarkMode ? "white" : undefined}
            className="focus:ring-0"
          />
          <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium text-left leading-6 text-gray-900 dark:text-white">
              Identificación oficial
            </label>
            <div className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${!cliente.foto_identificacion ? 'border-gray-400' : 'border-gray-900/25 dark:border-white'}`}>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Vista previa de la identificación" className="mx-auto h-48 w-48 rounded-md object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="foto_identificacion"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span className="px-1">Subir foto</span>
                      <input id="foto_identificacion" name="foto_identificacion" type="file" className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 dark:text-white">PNG, JPG, JPEG hasta 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button color="gray" onClick={() => navigate('/administrar-creditos')}>
            Cancelar
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditarCliente;
