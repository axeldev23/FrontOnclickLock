import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchPrestamo } from '../api/api'; // Asegúrate de ajustar la ruta del import
import { format, addWeeks } from 'date-fns'; // Asegúrate de tener date-fns instalado
import { Button } from "@material-tailwind/react";

const PaymentSchedulePDF = ({ prestamoId }) => {
    const generatePDF = async () => {
        try {
            const prestamo = await fetchPrestamo(prestamoId);
            const { monto_credito, interes, plazo_credito, equipo_a_adquirir, fecha_inicio } = prestamo;

            // Calculo del interés simple
            const interesSimple = monto_credito * (interes / 100);
            const totalPagar = parseFloat(monto_credito) + interesSimple;
            const montoSemanal = totalPagar / plazo_credito;

            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(`Plan de Pagos - ${equipo_a_adquirir}`, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Monto a Financiar: $${parseFloat(monto_credito).toFixed(2)}`, 14, 30);
            doc.text(`Total a Pagar con Intereses: $${totalPagar.toFixed(2)}`, 14, 35);

            const tableColumn = ["Semana", "Fecha de Pago", "Monto"];
            const tableRows = [];

            for (let i = 1; i <= plazo_credito; i++) {
                const paymentDate = format(addWeeks(new Date(fecha_inicio), i), 'dd/MM/yyyy');
                tableRows.push([i, paymentDate, montoSemanal.toFixed(2)]);
            }

            doc.autoTable({
                startY: 50,
                head: [tableColumn],
                body: tableRows,
            });

            doc.save(`Plan_de_Pagos_${prestamoId}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    return (
        <Button onClick={generatePDF} className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>

            Tabla de Amortización
        </Button>
    );
};

export default PaymentSchedulePDF;
