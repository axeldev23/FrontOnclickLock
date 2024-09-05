import React, { useState, useEffect, useContext } from 'react';
import FormCliente from './FormCliente';
import FormEquipo from './FormEquipo';
import ConfirmarRegistroCredito from './ConfirmarRegistroCredito';
import { createCliente, createPrestamo } from '../../api/api';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from '@material-tailwind/react';
import GenerarAmortizacion from '../Formatos/GenerarAmortizacion';
import { FaCheckCircle } from "react-icons/fa";
import GenerarPagare from '../Formatos/GenerarPagare';
import { AuthContext } from '../context/AuthContext';
import FormCotizacion from './FormCotizacion';
import MostrarCotizacion from './MostrarCotizacion';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prestamoId, setPrestamoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);

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
      equipo_imei: ''
    },
    credito: {
      plazo_credito: '',
      monto_credito: '',
      pago_inicial: '',
      interes: '',
      fecha_primer_pago: '',
      equipo_precio: ''
    }
  });

  const nextStep = () => {
    setStep(step + 1);
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

  const handleCotizacionSubmit = (cotizacionData) => {
    setFormData(prevState => ({
      ...prevState,
      credito: {
        ...prevState.credito,
        ...cotizacionData
      }
    }));
    nextStep();
  };

  const handleShowCotizacion = () => {
    nextStep();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const montoCreditoNumber = parseFloat(formData.credito.monto_credito);
    const roundedMontoCredito = !isNaN(montoCreditoNumber) ? montoCreditoNumber.toFixed(2) : '0.00';

    const updatedFormData = {
      ...formData,
      credito: {
        ...formData.credito,
        monto_credito: roundedMontoCredito
      }
    };

    if (parseFloat(updatedFormData.credito.monto_credito) > parseFloat(updatedFormData.credito.equipo_precio)) {
      toast.error("El monto del crédito no puede ser superior al precio del equipo.");
      setIsLoading(false);
      return;
    }

    // Log the data before submitting
    console.log('Datos antes de enviar a ConfirmarRegistroCredito:', JSON.stringify(updatedFormData));

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
        creado_por: user.id
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
        equipo_imei: ''
      },
      credito: {
        plazo_credito: '',
        monto_credito: '',
        pago_inicial: '',
        interes: '',
        fecha_primer_pago: '',
        equipo_precio: ''
      }
    });
    setStep(1);
  };

  return (
    <>
      {step === 1 && (
        <FormCotizacion
          formData={formData.credito}
          handleNext={handleCotizacionSubmit}
        />
      )}
      {step === 2 && (
        <MostrarCotizacion
          values={formData.credito}
          handleBack={prevStep}
          handleContinue={nextStep}
        />
      )}
      {step === 3 && (
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
      {step === 4 && (
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
      {step === 5 && (
        <ConfirmarRegistroCredito
          values={formData.credito}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}

      {/* Notification Modal */}
      <Dialog open={isModalOpen} handler={handleModalClose}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            ¡Registro Exitoso!
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <FaCheckCircle className="h-16 w-16 text-green-500" />
          <Typography variant="h4" color="green">
            El préstamo se ha registrado correctamente.
          </Typography>
          <div className="text-center font-normal flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <GenerarPagare prestamoId={prestamoId} />
            <GenerarAmortizacion prestamoId={prestamoId} />
          </div>

        </DialogBody>
        <DialogFooter className="space-x-2">
          
          <Button variant="gradient" onClick={handleModalClose}>
          Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default MultiStepForm;
