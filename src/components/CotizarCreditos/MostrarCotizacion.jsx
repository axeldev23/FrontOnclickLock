import React from 'react';

function MostrarCotizacion({ values, handleBack, handleContinue }) {
    const { monto_credito, plazo_credito, interes } = values;

    // Convertir los valores a números
    const montoCreditoNum = parseFloat(monto_credito) || 0;
    const plazoCreditoNum = parseInt(plazo_credito, 10) || 0;
    const interesNum = parseFloat(interes) || 0;

    const interesSimple = montoCreditoNum * (interesNum / 100);
    const totalPagar = montoCreditoNum + interesSimple;
    const montoSemanal = totalPagar / (plazoCreditoNum || 1); // Evitar división por 0

    return (
        <div className='flex justify-center w-full px-4 md:px-8 lg:px-16'>
            <div className='dark:shadow-custom shadow-2xl mt-5 mb-12 max-w-xl rounded-xl p-5 px-12 w-full max-w-4xl'>
                <div className="space-y-10">
                    <h1 className="text-xl w-full md:w-96 text-left mt-4 font-semibold">Cotización del Crédito</h1>
                    <div className="text-left">
                        <p><strong>Monto del crédito:</strong> ${montoCreditoNum.toFixed(2)}</p>
                        <p><strong>Interés:</strong> {interesNum}%</p>
                        <p><strong>Total a pagar:</strong> ${totalPagar.toFixed(2)}</p>
                        <p><strong>Plazo del crédito:</strong> {plazoCreditoNum} semanas</p>
                        <p><strong>Parcialidades semanales:</strong> ${montoSemanal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={handleBack} className="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white">
                            Modificar
                        </button>
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                            Continuar con el Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MostrarCotizacion;
