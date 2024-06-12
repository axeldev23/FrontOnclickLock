import React from 'react';

function Cotizacion({ values, prevStep, handleSubmit, isLoading }) {
    const { monto_credito, plazo_credito, interes } = values;
    const interesSimple = monto_credito * (interes / 100);
    const totalPagar = parseFloat(monto_credito) + interesSimple;
    const montoSemanal = totalPagar / plazo_credito;

    return (
        <div className='flex justify-center w-full px-4 md:px-8 lg:px-16'>
            <div className='dark:shadow-custom shadow-2xl mt-5 mb-12 max-w-xl rounded-xl p-5 px-12 w-full max-w-4xl'>
                <div className="space-y-10">
                    <h1 className="text-xl w-full md:w-96 text-left mt-4 font-semibold">Cotización del Crédito</h1>
                    <div className="text-left">
                        <p><strong>Monto del crédito:</strong> ${monto_credito.toFixed(2)}</p>
                        <p><strong>Interés:</strong> {interes}%</p>
                        <p><strong>Total a pagar:</strong> ${totalPagar.toFixed(2)}</p>
                        <p><strong>Plazo del crédito:</strong> {plazo_credito} semanas</p>
                        <p><strong>Parcialidades semanales:</strong> ${montoSemanal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">
                            Modificar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                            disabled={isLoading} 
                        >
                            {isLoading ? 'Registrando...' : 'Confirmar y Registrar'}  
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cotizacion;
