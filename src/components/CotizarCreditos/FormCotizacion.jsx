import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function FormCotizacion({ formData: initialData, handleNext }) {
    const [formData, setFormData] = useState(initialData);
    const [autoSelectDate, setAutoSelectDate] = useState(false);
    const [userModifiedMonto, setUserModifiedMonto] = useState(false); // Detecta si el usuario modificó el monto
    const [montoOriginal, setMontoOriginal] = useState(initialData.monto_credito); // Almacena el valor original del monto a financiar

    // Actualiza el monto a financiar cuando se cambia el precio del equipo, y limpia el pago inicial
    useEffect(() => {
        if (formData.equipo_precio && !userModifiedMonto) {
            const equipoPrecio = parseFloat(formData.equipo_precio) || 0;
            setFormData(prevState => ({
                ...prevState,
                monto_credito: equipoPrecio,
                pago_inicial: '' // Limpia el pago inicial cuando cambia el precio del equipo
            }));
            setMontoOriginal(equipoPrecio); // Actualiza el monto original
        }
    }, [formData.equipo_precio, userModifiedMonto]);

    // Calcula la fecha del primer pago automáticamente
    useEffect(() => {
        if (autoSelectDate) {
            const fetchNextPaymentDate = () => {
                try {
                    const currentDate = new Date();
                    let nextThursdayOrSunday = new Date(currentDate);
                    const dayOfWeek = currentDate.getDay();

                    if (dayOfWeek === 0) {
                        nextThursdayOrSunday.setDate(currentDate.getDate() + 3);
                    } else if (dayOfWeek === 4) {
                        nextThursdayOrSunday.setDate(currentDate.getDate() + 2);
                    } else {
                        let daysToAdd = (dayOfWeek <= 4) ? (3 - dayOfWeek) : (6 - dayOfWeek);
                        nextThursdayOrSunday.setDate(currentDate.getDate() + daysToAdd);
                    }

                    const formattedDate = nextThursdayOrSunday.toISOString().split('T')[0];
                    setFormData(prevState => ({
                        ...prevState,
                        fecha_primer_pago: formattedDate
                    }));
                } catch (error) {
                    console.error('Error fetching date from browser', error);
                    toast.error("Error al obtener la fecha actual. Por favor, intente nuevamente.");
                }
            };

            fetchNextPaymentDate();
        }
    }, [autoSelectDate]);

    // Maneja los cambios de los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        let parsedValue = value;
        let errorMessage = '';
    
        if (name === 'plazo_credito') {
            parsedValue = value === '' ? '' : parseInt(value, 10) || '';
            if (parsedValue !== '' && parsedValue < 1) {
                errorMessage = "El plazo del crédito debe ser al menos 1 semana.";
            }
            if (parsedValue !== '' && parsedValue > 156) {
                errorMessage = "El plazo del crédito no puede exceder las 156 semanas.";
            }
        }
    
        if (['equipo_precio', 'monto_credito', 'pago_inicial'].includes(name)) {
            if (!/^\d*\.?\d{0,2}$/.test(value)) {
                errorMessage = "Este campo solo permite números enteros o con hasta dos decimales.";
            }
    
            parsedValue = value;
            const floatParsedValue = parseFloat(parsedValue) || '';
    
            if (floatParsedValue < 0) {
                errorMessage = "El valor no puede ser negativo.";
            }
        }
    
        if (name === 'interes') {
            parsedValue = parseInt(value, 10) || '';
            if (!/^\d*$/.test(value) || value.length > 4) {
                errorMessage = "El interés solo puede contener números enteros y un máximo de 4 dígitos.";
            }
        }
    
        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }
    
        setFormData(prevState => {
            let newData = { ...prevState, [name]: parsedValue };
    
            if (name === 'equipo_precio') {
                // Si el usuario no ha modificado manualmente el monto, actualiza monto_credito y limpia pago_inicial
                if (!userModifiedMonto) {
                    const equipoPrecio = parseFloat(parsedValue) || 0;
                    newData.monto_credito = equipoPrecio;
                    newData.pago_inicial = ''; // Limpia el pago inicial cuando se modifica el precio del equipo
                    setMontoOriginal(equipoPrecio); // Actualiza el monto original
                }
            }
    
            if (name === 'pago_inicial') {
                const pagoInicialNum = parseFloat(parsedValue) || 0;
                if (parsedValue === '') {
                    // Si el campo de pago inicial está vacío, restablecer el monto original
                    newData.monto_credito = montoOriginal;
                } else {
                    // Restar el pago inicial del monto original ingresado por el usuario
                    newData.monto_credito = (montoOriginal - pagoInicialNum).toFixed(2);
                }
            }
    
            return newData;
        });
    };

    // Maneja los cambios en el monto a financiar y limpia el pago inicial
    const handleMontoCreditoChange = (event) => {
        const { value } = event.target;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setUserModifiedMonto(true); // Indica que el usuario ha modificado manualmente el monto
            setFormData(prevState => ({
                ...prevState,
                monto_credito: parseFloat(value) || '',
                pago_inicial: '' // Limpia el campo de pago inicial cuando se cambia el monto a financiar
            }));
            setMontoOriginal(parseFloat(value) || 0); // Almacena el valor original ingresado por el usuario
        }
    };

    // Maneja la lógica al enviar el formulario
    const handleSubmit = (event) => {
        event.preventDefault();

        const precioEquipo = parseFloat(formData.equipo_precio);
        const montoCredito = parseFloat(formData.monto_credito);
        const pagoInicial = parseFloat(formData.pago_inicial);
        const fechaPrimerPago = new Date(formData.fecha_primer_pago);
        const hoy = new Date();

        if (fechaPrimerPago < hoy.setHours(0, 0, 0, 0)) {
            toast.error("La fecha del primer pago no puede ser anterior a hoy.");
            return;
        }

        if (precioEquipo > 100000) {
            toast.error("El precio del equipo no puede ser mayor a 100,000.");
            return;
        }

        if (montoCredito > precioEquipo) {
            toast.error("El monto a financiar no puede ser mayor al precio del equipo.");
            return;
        }

        if (pagoInicial >= precioEquipo) {
            toast.error("El pago inicial no puede ser mayor o igual al precio del equipo.");
            return;
        }

        if (montoCredito + pagoInicial > precioEquipo) {
            toast.error("La suma del pago inicial y el monto a financiar no puede ser mayor al precio del equipo.");
            return;
        }

        if (precioEquipo < 0 || montoCredito < 0 || pagoInicial < 0) {
            toast.error("Los valores no pueden ser negativos.");
            return;
        }

        handleNext(formData);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='flex justify-center w-full px-4 md:px-8 lg:px-16'>
            <form className='dark:shadow-custom shadow-2xl mt-5 mb-12 max-w-xl rounded-xl p-5 px-12 w-full max-w-4xl' onSubmit={handleSubmit}>
                <div className="space-y-10">
                    <h1 className="text-xl w-full md:w-96 text-left mt-4 font-semibold">Cotización del Crédito</h1>

                    <div className="text-left">
                        <label htmlFor="plazo_credito" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Plazo del crédito (semanas)
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="plazo_credito"
                                id="plazo_credito"
                                value={formData.plazo_credito || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                min="1"
                                max="156"
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label htmlFor="equipo_precio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Precio del equipo
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="equipo_precio"
                                id="equipo_precio"
                                value={formData.equipo_precio || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Por favor, ingrese un número válido con hasta dos decimales."
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="monto_credito" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Monto a financiar
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="monto_credito"
                                id="monto_credito"
                                value={formData.monto_credito || ''}
                                onChange={handleMontoCreditoChange} // Nuevo handler para manejar los cambios del monto manual
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                disabled={!formData.equipo_precio}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Por favor, ingrese un número válido con hasta dos decimales."
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="pago_inicial" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Pago inicial
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="pago_inicial"
                                id="pago_inicial"
                                value={formData.pago_inicial || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                disabled={!formData.equipo_precio}
                                pattern="^\d+(\.\d{1,2})?$"
                                title="Por favor, ingrese un número válido con hasta dos decimales."
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="interes" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Interés (% anual)
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="interes"
                                id="interes"
                                value={formData.interes || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                pattern="^\d{1,4}$"
                                title="Por favor, ingrese un número entero de hasta 4 dígitos."
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="fecha_primer_pago" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Fecha del primer pago
                        </label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="fecha_primer_pago"
                                id="fecha_primer_pago"
                                value={formData.fecha_primer_pago || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                disabled={autoSelectDate}
                                min={today}  // Establece el mínimo como la fecha de hoy
                            />
                        </div>
                    </div>
                    <div className="flex items-center !mt-2 ">
                        <input
                            type="checkbox"
                            id="autoSelectDate"
                            checked={autoSelectDate}
                            onChange={() => setAutoSelectDate(!autoSelectDate)}
                        />
                        <label htmlFor="autoSelectDate" className="ml-2 text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Seleccionar automáticamente el próximo jueves o domingo
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FormCotizacion;
