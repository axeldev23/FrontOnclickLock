import React from 'react';
import Layout from './Layout';

function FormCredito({ prevStep, handleChange, values, handleSubmit }) {
    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <div className="space-y-10">
                    <h1 className="text-xl w-96 font-semibold">Registro del Crédito</h1>

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
                                value={values.monto_credito || ''}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required
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
                        <button type="submit" className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white">
                            Registrar
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
}

export default FormCredito;
