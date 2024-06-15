import React from 'react';
import { fetchPrestamo, fetchCliente, generarPagare } from '../api/api'; // Ajusta la ruta según sea necesario
import { format, addWeeks } from 'date-fns'; // Asegúrate de tener date-fns instalado
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
                pago_inicial
            } = prestamo;

            const {
                nombre_completo,
                clave_elector,
                domicilio_actual
            } = cliente;

            // Calcular fechas de primer y último pago
            const fechaPrimerPago = format(addWeeks(new Date(fecha_inicio), 1), 'dd-MM-yyyy');
            const fechaUltimoPago = format(addWeeks(new Date(fecha_inicio), plazo_credito), 'dd-MM-yyyy');
            const fechaInicioFormatted = format(new Date(fecha_inicio), 'dd-MM-yyyy');

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
                variable_fecha_primer_pago: fechaPrimerPago,
                variable_fecha_ultimo_pago: fechaUltimoPago
            };

            await generarPagare(data);
        } catch (error) {
            console.error("Error al generar el pagaré:", error);
        }
    };

    return (
        <Button onClick={generatePagare} className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Generar Pagaré
        </Button>
    );
};

export default ContratoCreditoPDF;
