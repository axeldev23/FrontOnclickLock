import React from 'react';
import { toast } from 'react-toastify';

function FormCredito({ prevStep, handleChange, values, handleShowCotizacion, equipoPrecio }) {
    const handleNext = () => {
        // Redondear el valor de monto_credito antes de validar
        const monto_credito = parseFloat(values.monto_credito).toFixed(2);

        if (values.plazo_credito && monto_credito && values.pago_inicial && values.interes) {
            if (parseFloat(values.pago_inicial) < parseFloat(equipoPrecio)) {
                handleShowCotizacion();
            } else {
                toast.error("El pago inicial debe ser menor al precio del equipo.");
            }
        } else {
            toast.error("Por favor, complete todos los campos antes de continuar.");
        }
    }

    const handleMontoCreditoChange = (event) => {
        const { name, value } = event.target;
        // Formatear el valor del campo para que solo tenga dos decimales
        const formattedValue = parseFloat(value).toFixed(2);
        handleChange({ target: { name, value: formattedValue } });
    };

    return (
        <div className='flex justify-center w-full px-4 md:px-8 lg:px-16'>
            <form className='dark:shadow-custom shadow-2xl mt-5 mb-12 max-w-xl rounded-xl p-5 px-12 w-full max-w-4xl'>
                <div className="space-y-10">
                    <h1 className="text-xl w-full md:w-96 text-left mt-4 font-semibold">Registro del Crédito</h1>

                    <div className="text-left">
                        <label htmlFor="plazo_credito" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Plazo del crédito (semanas)
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="plazo_credito"
                                id="plazo_credito"
                                value={values.plazo_credito || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="monto_credito" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Monto del crédito
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="monto_credito"
                                id="monto_credito"
                                value={values.monto_credito ? parseFloat(values.monto_credito).toFixed(2) : ''}
                                onChange={handleMontoCreditoChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                                readOnly // Evitar que el usuario edite este campo directamente
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="pago_inicial" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Pago inicial
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="pago_inicial"
                                id="pago_inicial"
                                value={values.pago_inicial || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-left mt-8">
                        <label htmlFor="interes" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Interés (% anual)
                        </label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="interes"
                                id="interes"
                                value={values.interes || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">
                            Volver
                        </button>
                        <button type="button" onClick={handleNext} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white">
                            Ver Cotización
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default FormCredito;
