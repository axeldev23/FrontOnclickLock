import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchPrestamo } from '../api/api'; // Asegúrate de ajustar la ruta del import
import { format, addWeeks } from 'date-fns'; // Asegúrate de tener date-fns instalado

const PaymentSchedulePDF = ({ prestamoId }) => {
    const generatePDF = async () => {
        try {
            const prestamo = await fetchPrestamo(prestamoId);
            const { monto_credito, interes, plazo_credito, equipo_a_adquirir, fecha_inicio } = prestamo;
            const interesSemanal = (monto_credito * (interes / 100)) / 52;
            const totalInteres = interesSemanal * plazo_credito;
            const totalPagar = parseFloat(monto_credito) + totalInteres;
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
        <button onClick={generatePDF} className="bg-green-500 hover:bg-green-600 px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded transition ease-in duration-300">
            Descargar Formato de Pagos
        </button>
    );
};

export default PaymentSchedulePDF;
