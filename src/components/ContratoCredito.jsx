import React from 'react';
import { fetchPrestamo, fetchCliente, generarPagare } from '../api/api'; // Ajusta la ruta según sea necesario
import { format, addWeeks, addDays } from 'date-fns'; // Asegúrate de tener date-fns instalado
import { Button } from "@material-tailwind/react";

const ContratoCreditoPDF = ({ prestamoId }) => {
    const generatePagare = async () => {
        try {
            const prestamo = await fetchPrestamo(prestamoId);
            const cliente = await fetchCliente(prestamo.cliente);

            const {
                monto_credito,
                interes,
                plazo_credito,
                equipo_a_adquirir,
                fecha_inicio,
                fecha_primer_pago
            } = prestamo;

            const {
                nombre_completo,
                clave_elector,
                domicilio_actual
            } = cliente;

            // Convertir las fechas a objetos Date
            const fechaPrimerPagoDate = new Date(fecha_primer_pago);
            const fechaInicioDate = new Date(fecha_inicio);

            // Agregar un día a la fecha del primer pago
            const fechaPrimerPagoConDiaExtraDate = addDays(fechaPrimerPagoDate, 1);
            // Calcular la fecha del último pago sumando el plazo en semanas a la fecha del primer pago
            const fechaUltimoPagoDate = addWeeks(fechaPrimerPagoConDiaExtraDate, plazo_credito - 1); // restamos 1 porque el primer pago ya cuenta como semana 1

            // Formatear fechas
            const fechaUltimoPago = format(fechaUltimoPagoDate, 'dd-MM-yyyy');
            const fechaPrimerPago = format(fechaPrimerPagoConDiaExtraDate, 'dd-MM-yyyy');
            const fechaInicioFormatted = format(fechaInicioDate, 'dd-MM-yyyy');

            const data = {
                id: prestamoId,
                fecha_inicio: fechaInicioFormatted,
                equipo_a_adquirir,
                interes,
                plazo_credito,
                nombre_completo,
                clave_elector,
                domicilio_actual,
                variable_total_a_pagar: (parseFloat(monto_credito) * (1 + interes / 100)).toFixed(2),
                variable_fecha_primer_pago: fechaPrimerPago, // Utilizar la fecha formateada
                variable_fecha_ultimo_pago: fechaUltimoPago
            };

            await generarPagare(data);
        } catch (error) {
            console.error("Error al generar el pagaré:", error);
        }
    };

    return (
        <Button onClick={generatePagare} className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Generar Pagaré
        </Button>
    );
};

export default ContratoCreditoPDF;
