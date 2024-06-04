import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { fetchClientes } from '../api/api';
import { toast } from 'react-toastify';

function FormCliente({ nextStep, handleChange, values, setFormData, setIsNewClient, isNewClient }) {
  const [clientes, setClientes] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        const data = await fetchClientes();
        setClientes(data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    loadClientes();
  }, []);

  function handleNext() {
    const form = document.getElementById("formCliente");
    if (isNewClient) {
      if (form.checkValidity()) {
        nextStep();
      } else {
        form.reportValidity(); // Muestra mensajes de error nativos del navegador
      }
    } else {
      if (values.cliente_id) {
        nextStep();
      } else {
        toast.error("Por favor, seleccione un cliente existente o cree un nuevo cliente.");
      }
    }
  }

  const toggleNewClient = () => {
    setIsNewClient(!isNewClient);
    setFormData(prevState => ({
      ...prevState,
      cliente_id: '' // Clear selected client
    }));
  }

  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: `${cliente.nombre_completo} - ${cliente.numero_telefono}`
  }));

  const handleSelectChange = selectedOption => {
    setFormData(prevState => ({
      ...prevState,
      cliente_id: selectedOption ? selectedOption.value : ''
    }));

    if (selectedOption) {
      setIsNewClient(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      cliente: {
        ...prevState.cliente,
        foto_identificacion: file
      }
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prevState => ({
      ...prevState,
      cliente: {
        ...prevState.cliente,
        foto_identificacion: null
      }
    }));
    setImagePreview(null);
  };

  return (
    <Layout>
      <form id="formCliente" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-10">
          <h1 className="text-xl w-96 font-semibold">Registro del Cliente</h1>
          
          <div>
            <label htmlFor="clienteExistente" className="block text-sm font-medium text-left leading-6 text-gray-900 dark:text-white mb-2">
              Cliente Existente
            </label>
            <Select
              id="clienteExistente"
              options={clienteOptions}
              isDisabled={isNewClient}
              className='text-gray-900'
              onChange={handleSelectChange}
              value={clienteOptions.find(option => option.value === values.cliente_id) || null}
              placeholder="Seleccione un cliente..."
              isClearable
              noOptionsMessage={() => "No se encontró ningún cliente"}
            />
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isNewClient}
                onChange={toggleNewClient}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2">Crear nuevo cliente</span>
            </label>
          </div>

          <div className="text-left">
            <label htmlFor="nombre_completo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Nombre completo
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="nombre_completo"
                id="nombre_completo"
                autoComplete="name"
                value={values.cliente.nombre_completo || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={isNewClient}
                disabled={!isNewClient}
              />
            </div>
          </div>

          <div className="text-left mt-8">
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Fecha de nacimiento
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="fecha_nacimiento"
                id="fecha_nacimiento"
                value={values.cliente.fecha_nacimiento || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={isNewClient}
                disabled={!isNewClient}
              />
            </div>
          </div>

          <div className="text-left mt-8">
            <label htmlFor="domicilio_actual" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Domicilio actual
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="domicilio_actual"
                id="domicilio_actual"
                value={values.cliente.domicilio_actual || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={isNewClient}
                disabled={!isNewClient}
              />
            </div>
          </div>

          <div className="text-left mt-8">
            <label htmlFor="correo_electronico" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Correo electrónico
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="correo_electronico"
                id="correo_electronico"
                value={values.cliente.correo_electronico || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={isNewClient}
                disabled={!isNewClient}
              />
            </div>
          </div>

          <div className="text-left mt-8">
            <label htmlFor="numero_telefono" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Número de teléfono
            </label>
            <div className="mt-2">
              <input
                type="tel"
                name="numero_telefono"
                id="numero_telefono"
                pattern="[0-9]{10}"
                value={values.cliente.numero_telefono || ''}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={isNewClient}
                disabled={!isNewClient}
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="cover-photo" className="block text-sm font-medium text-left leading-6 text-gray-900 dark:text-white">
              Identificación oficial
            </label>
            <div className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 ${!isNewClient ? 'cursor-not-allowed border-gray-400' : 'border-gray-900/25 dark:border-white'}`}>
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
                      className={`relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 ${!isNewClient ? 'cursor-not-allowed bg-gray-400 text-gray-100 hover:text-gray-100' : ''}`}
                    >
                      <span className='px-1'>Subir foto</span>
                      <input id="foto_identificacion" name="foto_identificacion" type="file" className="sr-only" onChange={handleFileChange} disabled={!isNewClient} />
                    </label>
                    
                  </div>
                  <p className="text-xs leading-5 text-gray-600 dark:text-white">PNG, JPG, JPEG hasta 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={handleNext} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
              Siguiente
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export default FormCliente;
