import React, { useState } from 'react';
import FormCliente from './FormCliente';
import FormEquipo from './FormEquipo';
import FormCredito from './FormCredito';
import { createCliente, createPrestamo } from '../api/api';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import PaymentSchedulePDF from './PaymentSchedulePDF'; // Asegúrate de ajustar la ruta según corresponda
import { FaCheckCircle } from "react-icons/fa";


Modal.setAppElement('#root');

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prestamoId, setPrestamoId] = useState(null); // Para almacenar el ID del préstamo creado

  const [formData, setFormData] = useState({
    cliente_id: '',
    cliente: {
      nombre_completo: '',
      fecha_nacimiento: '',
      domicilio_actual: '',
      correo_electronico: '',
      numero_telefono: '',
      foto_identificacion: null
    },
    equipo: {
      equipo_a_adquirir: '',
      equipo_precio: '',
      equipo_imei: ''
    },
    credito: {
      plazo_credito: '',
      monto_credito: '',
      pago_inicial: '',
      interes: ''
    }
  });

  const nextStep = () => {
    if (step === 2 && parseFloat(formData.credito.monto_credito) > parseFloat(formData.equipo.equipo_precio)) {
      toast.error("El monto del crédito no puede ser superior al precio del equipo.");
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (section) => (event) => {
    const { name, value, type, files } = event.target;
    const newValue = type === 'file' ? files[0] : value;
    setFormData(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: newValue
      }
    }));
  };

  const handleFileChange = (event) => {
    setFormData(prevState => ({
      ...prevState,
      cliente: {
        ...prevState.cliente,
        foto_identificacion: event.target.files[0]
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (parseFloat(formData.credito.monto_credito) > parseFloat(formData.equipo.equipo_precio)) {
      toast.error("El monto del crédito no puede ser superior al precio del equipo.");
      return;
    }
    console.log('Datos del formulario:', formData);
    try {
      let clienteId = formData.cliente_id;
      if (isNewClient) {
        const clienteData = {
          ...formData.cliente,
          foto_identificacion: formData.cliente.foto_identificacion ? formData.cliente.foto_identificacion : ""
        };
        console.log('Petición a createCliente con datos:', JSON.stringify(clienteData));
        const clienteResponse = await createCliente(clienteData);
        clienteId = clienteResponse.id;
      }

      const prestamoData = {
        cliente: clienteId,
        ...formData.equipo,
        ...formData.credito
      };
      console.log('Petición a createPrestamo con datos:', JSON.stringify(prestamoData));
      const prestamoResponse = await createPrestamo(prestamoData);

      // Guardar el ID del préstamo y mostrar el modal de éxito
      setPrestamoId(prestamoResponse.id);
      setIsModalOpen(true);

    } catch (error) {
      console.error('Error creando préstamo:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Limpiar los datos del formulario
    setFormData({
      cliente_id: '',
      cliente: {
        nombre_completo: '',
        fecha_nacimiento: '',
        domicilio_actual: '',
        correo_electronico: '',
        numero_telefono: '',
        foto_identificacion: null
      },
      equipo: {
        equipo_a_adquirir: '',
        equipo_precio: '',
        equipo_imei: ''
      },
      credito: {
        plazo_credito: '',
        monto_credito: '',
        pago_inicial: '',
        interes: ''
      }
    });
    setStep(1);
  };

  return (
    <>
      {step === 1 && (
        <FormCliente
          nextStep={nextStep}
          handleChange={handleChange('cliente')}
          handleFileChange={handleFileChange}
          values={{ ...formData, cliente_id: formData.cliente_id }}
          setFormData={setFormData}
          setIsNewClient={setIsNewClient}
          isNewClient={isNewClient}
        />
      )}
      {step === 2 && (
        <FormEquipo
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange('equipo')}
          values={formData.equipo}
        />
      )}
      {step === 3 && (
        <FormCredito
          handleSubmit={handleSubmit}
          prevStep={prevStep}
          handleChange={handleChange('credito')}
          values={formData.credito}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Éxito"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-gray-800 border border-gray-800 shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
          <div className="text-center p-3 flex-auto justify-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full p-1">
            <FaCheckCircle  className="text-green-500 text-6xl" />

            </div>


            <h2 className="text-xl font-bold py-4 text-gray-200">¡Registro exitoso!</h2>
            <p className="text-sm text-gray-200 px-2">
              ¿Desea descargar el formato de pagos y el formato de compra?
            </p>
          </div>
          <div className="p-2 mt-2 text-center space-y-1 md:block">
           
            <PaymentSchedulePDF prestamoId={prestamoId} />
            <button
              onClick={() => { /* lógica para descargar el formato de compra */ }}
              className="bg-blue-500 hover:bg-blue-700 px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-blue-300 hover:border-blue-500 text-white rounded transition ease-in duration-300"
            >
              Descargar Formato de Compra
            </button>

            <br />
            <br />
            <button
              onClick={handleModalClose}
              className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MultiStepForm;
