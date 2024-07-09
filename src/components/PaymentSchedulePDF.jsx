import React from 'react';
import { fetchPrestamo, fetchCliente, generarAmortizacion } from '../api/api'; // Asegúrate de ajustar la ruta del import
import { format, addDays } from 'date-fns'; // Asegúrate de tener date-fns instalado
import { Button } from "@material-tailwind/react";

const PaymentSchedulePDF = ({ prestamoId }) => {
    const generateAmortizacion = async () => {
        try {
            const prestamo = await fetchPrestamo(prestamoId);
            const cliente = await fetchCliente(prestamo.cliente);

            const {
                monto_credito,
                interes,
                imei,
                plazo_credito,
                equipo_a_adquirir,
                fecha_inicio,
                pago_inicial,
                id,

            } = prestamo;

            const {
                nombre_completo,
                
                domicilio_actual,
                numero_telefono,
                clave_elector
            } = cliente;

            // Calculo del interés simple
            const interesSimple = monto_credito * (interes / 100);
            const totalPagar = parseFloat(monto_credito) + interesSimple;
            const montoSemanal = totalPagar / plazo_credito;

            // Calcula la fecha de inicio del primer pago sumando 7 días
            const fechaPrimerPago = addDays(new Date(fecha_inicio), 7);

            const data = new FormData();
            data.append('nombre_completo', nombre_completo);
            data.append('equipo_a_adquirir', equipo_a_adquirir);
            data.append('equipo_precio', prestamo.equipo_precio);
            data.append('pago_inicial', pago_inicial);
            data.append('monto_credito', monto_credito);
            data.append('plazo_credito', plazo_credito);
            data.append('monto_parcialidad', montoSemanal.toFixed(2));
            data.append('fecha_inicial', format(fechaPrimerPago, 'yyyy-MM-dd')); // Fecha de inicio del primer pago
            data.append('total_a_pagar', totalPagar.toFixed(2));
            data.append('fecha_inicio', format(fecha_inicio, 'yyyy-MM-dd'));
            data.append('imei', imei);
            data.append('prestamo_id', id);
            data.append('domicilio_actual', domicilio_actual);
            data.append('numero_telefono', numero_telefono);


            await generarAmortizacion(data);
        } catch (error) {
            console.error("Error al generar la tabla de amortización:", error);
        }
    };

    return (
        <Button onClick={generateAmortizacion} className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Tabla de Amortización
        </Button>
    );
};

export default PaymentSchedulePDF;
