import React, { useState, useEffect, useContext } from 'react';
import FormCliente from './FormCliente';
import FormEquipo from './FormEquipo';
import FormCredito from './FormCredito';
import Cotizacion from './Cotizacion';
import { createCliente, createPrestamo } from '../api/api';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import PaymentSchedulePDF from './PaymentSchedulePDF';
import { FaCheckCircle } from "react-icons/fa";
import ContratoCreditoPDF from './ContratoCredito';
import { AuthContext } from './context/AuthContext'; // Importa el contexto de autenticación

Modal.setAppElement('#root');

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prestamoId, setPrestamoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext); // Usa el contexto de autenticación para obtener el usuario


  const [formData, setFormData] = useState({
    cliente_id: '',
    cliente: {
      nombre_completo: '',
      clave_elector: '',
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
      interes: '',
      fecha_primer_pago: ''
    }
  });

  useEffect(() => {
    const updatedMontoCredito = formData.equipo.equipo_precio - (formData.credito.pago_inicial || 0);
    setFormData(prevState => ({
      ...prevState,
      credito: {
        ...prevState.credito,
        monto_credito: updatedMontoCredito
      }
    }));
  }, [formData.equipo.equipo_precio, formData.credito.pago_inicial]);





  const nextStep = () => {
    if (step === 2 && parseFloat(formData.credito.monto_credito) > parseFloat(formData.equipo.equipo_precio)) {
      toast.error("El monto del crédito no puede ser superior al precio del equipo.");
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step === 4) {
      setFormData(prevState => ({
        ...prevState,
        credito: {
          ...prevState.credito,
          pago_inicial: '',
        }
      }));
    }
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

  const handleShowCotizacion = () => {
    setStep(4);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const roundedMontoCredito = parseFloat(formData.credito.monto_credito).toFixed(2);
    const updatedFormData = {
      ...formData,
      credito: {
        ...formData.credito,
        monto_credito: roundedMontoCredito
      }
    };

    if (parseFloat(updatedFormData.credito.monto_credito) > parseFloat(updatedFormData.equipo.equipo_precio)) {
      toast.error("El monto del crédito no puede ser superior al precio del equipo.");
      setIsLoading(false);
      return;
    }
    console.log('Datos del formulario:', updatedFormData);

    try {
      let clienteId = formData.cliente_id;
      if (isNewClient) {
        const clienteData = {
          ...updatedFormData.cliente,
          foto_identificacion: updatedFormData.cliente.foto_identificacion ? updatedFormData.cliente.foto_identificacion : ""
        };
        console.log('Petición a createCliente con datos:', JSON.stringify(clienteData));
        const { data, status } = await createCliente(clienteData);
        if (status !== 201) {
          toast.error(data.clave_elector?.[0] || "Error al crear el cliente");
          setIsLoading(false);
          return;
        }
        clienteId = data.id;
      }

      const prestamoData = {
        cliente: clienteId,
        ...updatedFormData.equipo,
        ...updatedFormData.credito,
        creado_por: user.id // Añade el usuario actual al objeto prestamoData
      };
      console.log('Petición a createPrestamo con datos:', JSON.stringify(prestamoData));
      const { data: prestamoDataResponse, status: prestamoStatus } = await createPrestamo(prestamoData);

      if (prestamoStatus === 202 || prestamoStatus === 201) {
        setPrestamoId(prestamoDataResponse.id);
        setIsModalOpen(true);
      } else {
        toast.error(prestamoDataResponse.message || "Error al crear el préstamo");
      }

      setIsLoading(false);

    } catch (error) {
      console.error('Error creando préstamo:', error);
      toast.error(error.response?.data?.message || "Error desconocido al crear el préstamo");
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({
      cliente_id: '',
      cliente: {
        nombre_completo: '',
        clave_elector: '',
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
        interes: '',
        fecha_primer_pago: ''
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
          setMontoCredito={(value) => setFormData(prevState => ({
            ...prevState,
            credito: {
              ...prevState.credito,
              monto_credito: value
            }
          }))}
        />
      )}
      {step === 3 && (
        <FormCredito
          handleShowCotizacion={handleShowCotizacion}
          prevStep={prevStep}
          handleChange={handleChange('credito')}
          values={formData.credito}
          equipoPrecio={formData.equipo.equipo_precio}
        />
      )}
      {step === 4 && (
        <Cotizacion
          values={formData.credito}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Éxito"
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 "
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 z-50"
      >
        <div className="bg-gray-800 border border-gray-800 shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
          <div className="text-center p-3 flex-auto justify-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full p-1">
              <FaCheckCircle className="text-green-500 text-6xl" />
            </div>
            <h2 className="text-xl font-bold py-4 text-gray-200">¡Registro exitoso!</h2>
            <p className="text-sm text-gray-200 px-2">
              ¿Desea descargar el formato de pagos y el formato de compra?
            </p>
          </div>
          <div className="p-2 mt-2 text-center space-y-1 md:block  ">
            <div className='flex flex-col items-center justify-center gap-3'>
              <PaymentSchedulePDF prestamoId={prestamoId} />
              <ContratoCreditoPDF prestamoId={prestamoId} />
            </div>
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
