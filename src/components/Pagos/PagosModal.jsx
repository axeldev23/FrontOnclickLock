import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton,
    Typography,
    Card,
    Checkbox,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { registrarPago } from '../../api/api'; // Asegúrate de tener la ruta correcta

const PagosModal = ({ isOpen, handleClose, prestamo, pagos, cliente }) => {
    const [selectedPagos, setSelectedPagos] = useState([]);

    const formatFechaPago = (fecha) => {
        const fechaObj = new Date(fecha + 'T00:00:00'); // Asegura que la fecha se interprete en UTC
        return format(fechaObj, 'dd-MM-yyyy'); // Formato de fecha deseado
    };

    const handleCheckboxChange = (pagoId) => {
        if (selectedPagos.includes(pagoId)) {
            setSelectedPagos(selectedPagos.filter(id => id !== pagoId));
        } else {
            setSelectedPagos([...selectedPagos, pagoId]);
        }
    };

    const handleRegistrarPagos = async () => {
        // Registrar pagos múltiples
        try {
            await Promise.all(
                selectedPagos.map(async (pagoId) => {
                    await registrarPago(pagoId);
                })
            );
            console.log('Pagos registrados exitosamente:', selectedPagos);
            setSelectedPagos([]); // Limpiar selección después de registrar
            handleClose(); // Cerrar el modal después de registrar
        } catch (error) {
            console.error('Error registrando los pagos:', error);
        }
    };

    const handleRegistrarPagoIndividual = async (pagoId) => {
        // Registrar un pago individual
        try {
            await registrarPago(pagoId);
            console.log('Pago registrado exitosamente:', pagoId);
            // Puedes actualizar el estado de los pagos si es necesario
        } catch (error) {
            console.error('Error registrando el pago:', error);
        }
    };

    return (
        <Dialog size="xl" open={isOpen} handler={handleClose} className="p-4">
            <DialogHeader className="relative m-0 block">
                <Typography variant="h4" color="blue-gray">
                    Cliente: {cliente?.nombre_completo}
                </Typography>
                <Typography className="mt-1 font-normal text-gray-600">
                    Pagos del Préstamo: {prestamo?.equipo_a_adquirir}
                </Typography>
                <IconButton
                    size="sm"
                    variant="text"
                    className="!absolute right-3.5 top-3.5"
                    onClick={handleClose}
                >
                    <XMarkIcon className="h-4 w-4 stroke-2" />
                </IconButton>
            </DialogHeader>
            <DialogBody divider className="space-y-4 pb-6 overflow-y-auto max-h-[600px]">
                <Card className="h-full w-full overflow-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Seleccionar
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Número de Pago
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Fecha de Pago
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Monto
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Estado
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none"
                                    >
                                        Acciones
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagos.map((pago, index) => (
                                <tr key={pago.id}>
                                    <td className="p-4">
                                        <Checkbox
                                            checked={selectedPagos.includes(pago.id)}
                                            onChange={() => handleCheckboxChange(pago.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-bold"
                                        >
                                            #{index + 1}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            className="font-normal text-gray-600"
                                        >
                                            {formatFechaPago(pago.fecha_pago_programada)}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            className="font-normal text-gray-600"
                                        >
                                            ${pago.monto_pago}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            className="font-normal text-gray-600"
                                        >
                                            {pago.pagado ? 'Pagado' : 'Pendiente'}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            size="sm"
                                            onClick={() => handleRegistrarPagoIndividual(pago.id)}
                                        >
                                            Registrar Pago
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </DialogBody>
            <DialogFooter>
                <Button
                    onClick={handleRegistrarPagos}
                    disabled={selectedPagos.length === 0}
                    className="mr-4"
                >
                    Registrar Pagos
                </Button>
                <Button className="" onClick={handleClose}>
                    Cerrar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default PagosModal;
