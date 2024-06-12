import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fetchPrestamo, fetchCliente } from '../api/api'; // Ajusta la ruta según sea necesario
import { format } from 'date-fns';
import { Button } from "@material-tailwind/react";

const ContratoCreditoPDF = ({ prestamoId }) => {
    const generatePDF = async () => {
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
                fecha_nacimiento,
                domicilio_actual,
                correo_electronico,
                numero_telefono
            } = cliente;

            // Calculo del interés simple
            const interesSimple = monto_credito * (interes / 100);
            const totalPagar = parseFloat(monto_credito) + interesSimple;
            const montoSemanal = totalPagar / plazo_credito;

            const doc = new jsPDF();
            const pageHeight = doc.internal.pageSize.getHeight();
            const marginBottom = 20;

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text('Contrato de Crédito', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");

            // 1. Datos de la firma
            doc.autoTable({
                startY: 35,
                head: [
                    [
                        {
                            content: '1. Datos de la Firma',
                            colSpan: 3,
                            styles: { valign: 'middle', halign: 'center' },
                        },
                    ],
                ],
                body: [
                    ['1.1', 'Fecha', format(new Date(fecha_inicio), 'dd/MM/yyyy')],
                    ['1.2', 'Número de contrato', prestamoId],
                ],
            });

            // 2. Datos del crédito
            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [
                    [
                        {
                            content: '2. Datos del Crédito',
                            colSpan: 3,
                            styles: { valign: 'middle', halign: 'center' },
                        },
                    ],
                ],
                body: [
                    ['2.1', 'Monto del crédito autorizado', `$${parseFloat(monto_credito).toFixed(2)}`],
                    ['2.2', 'Monto del enganche', `$${parseFloat(pago_inicial).toFixed(2)}`],
                    ['2.3', 'Tasa de interés', `${interes}%`],
                    ['2.4', 'Monto total por pagar', `$${totalPagar.toFixed(2)}`],
                ],
            });

            // 3. Plazo del crédito
            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [
                    [
                        {
                            content: '3. Plazo del Crédito',
                            colSpan: 3,
                            styles: { valign: 'middle', halign: 'center' },
                        },
                    ],
                ],
                body: [
                    ['3.1', 'Plazo del crédito (semanas)', plazo_credito],
                    ['3.2', 'Parcialidades', `$${montoSemanal.toFixed(2)}`],
                ],
            });

            // 4. Datos del acreditado
            doc.autoTable({
                startY: doc.previousAutoTable.finalY + 10,
                head: [
                    [
                        {
                            content: '4. Datos del Acreditado',
                            colSpan: 3,
                            styles: { valign: 'middle', halign: 'center' },
                        },
                    ],
                ],
                body: [
                    ['4.1', 'Nombre Completo', nombre_completo],
                    ['4.2', 'Fecha de Nacimiento', format(new Date(fecha_nacimiento), 'dd/MM/yyyy')],
                    ['4.3', 'Domicilio Actual', domicilio_actual],
                    ['4.4', 'Correo Electrónico', correo_electronico],
                    ['4.5', 'Número de Teléfono', numero_telefono],
                ],
            });

            // Clausulas
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('Cláusulas', doc.internal.pageSize.getWidth() / 2, doc.previousAutoTable.finalY + 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const clausulas = `
1. El ACREDITANTE acepta conceder al ACREDITADO el crédito especificado en este documento.
2. El ACREDITADO se compromete a pagar el crédito en las condiciones acordadas.
3. Si el ACREDITADO incumple con los pagos, el ACREDITANTE podrá tomar medidas legales para recuperar el monto adeudado.
4. Cualquier modificación a este contrato debe ser acordada por ambas partes y formalizada por escrito.
5. Las partes se someten a la jurisdicción de los tribunales competentes.

            `;
            const splitClausulas = doc.splitTextToSize(clausulas, 180);
            let currentY = doc.previousAutoTable.finalY + 30;
            splitClausulas.forEach((line, index) => {
                doc.text(line, 14, currentY);
                currentY += 7; // Ajusta este valor para dar más espacio entre líneas
            });

            // Comprobar si necesitamos una nueva página para el pagaré
            if (currentY + 60 > pageHeight - marginBottom) {
                doc.addPage();
                currentY = 20; // Nueva posición de inicio para la nueva página
            } else {
                currentY += 20;
            }

            // Pagaré
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text('Pagaré', doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const pagare = `
Monto: $${parseFloat(monto_credito).toFixed(2)}

Yo, ${nombre_completo}, con domicilio en ${domicilio_actual} y número de teléfono ${numero_telefono}, me comprometo a pagar a Onclick la cantidad de $${totalPagar.toFixed(2)}, correspondiente al crédito recibido.
En caso de incumplimiento, Onclick podrá tomar las acciones legales pertinentes para recuperar el monto adeudado.




Firma del Cliente:




_______________________________
${nombre_completo}
            `;
            const splitPagare = doc.splitTextToSize(pagare, 180);
            currentY += 10;
            splitPagare.forEach((line, index) => {
                if (currentY > pageHeight - marginBottom) {
                    doc.addPage();
                    currentY = 20; // Nueva posición de inicio para la nueva página
                }
                doc.text(line, 14, currentY);
                currentY += 7; // Ajusta este valor para dar más espacio entre líneas
            });

            doc.save(`Contrato_Credito_${prestamoId}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    return (
        <Button onClick={generatePDF} className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>

            Contrato de Crédito
        </Button>
    );
};

export default ContratoCreditoPDF;
