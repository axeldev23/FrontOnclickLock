import React, { useState, useEffect } from 'react';
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
    Chip,

} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { registrarPago } from '../../api/api'; // Asegúrate de tener la ruta correcta
import { desregistrarPago } from '../../api/api'; // Asegúrate de tener la ruta correcta
import ConfirmacionModal from './ConfirmacionModal';
import SMSModal from './SMSModal';
import { actualizarEstatusPagos } from '../../api/api';
import FinalizarCreditoModal from './FinalizarCreditoModal';






const PagosModal = ({ isOpen, handleClose, prestamo, pagos, cliente, setPagos }) => {
    const [selectedPagos, setSelectedPagos] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [SMSModalOpen, setSMSModalOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState(null); // Guardar acción actual
    const [currentPagoId, setCurrentPagoId] = useState(null); // ID del pago actual
    const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Nuevo estado
    const [message, setMessage] = useState('');

    const calcularSaldoRestante = (pagos, prestamo) => {
        if (pagos.length === 0) return '0.00'; // Verifica que haya pagos para evitar errores
        
        const montoPorPago = parseFloat(pagos[0].monto_pago); // Toma el monto de un solo pago
        const totalPagos = pagos.length; // Número total de pagos programados
        const pagosRealizados = pagos.filter((pago) => pago.pagado).length; // Número de pagos realizados
    
        // Cálculo del saldo restante
        const saldoRestante = (totalPagos - pagosRealizados) * montoPorPago;
        return saldoRestante.toFixed(2); // Devuelve el saldo con dos decimales
    };
    

    const generarMensajePagoUnico = (pago, pagos, prestamo, cliente) => {
        const saldoRestante = calcularSaldoRestante(pagos, prestamo);
        const fechaRegistro = new Date(); // Fecha actual
        const fechaRegistroFormateada = format(fechaRegistro, 'dd-MM-yyyy'); // Formato deseado
    
        return `Estimado/a ${cliente.nombre_completo}, Hemos recibido su pago registrado el día ${fechaRegistroFormateada} por la cantidad de $${parseFloat(pago.monto_pago).toFixed(2)}. Su saldo restante es de $${saldoRestante}. Gracias por su puntualidad en los pagos.`;
    };
    

    const generarMensajeMultiplesPagos = (pagosRegistrados, pagos, prestamo, cliente) => {
        const totalPagado = pagosRegistrados.reduce((suma, pago) => suma + parseFloat(pago.monto_pago), 0);
        const saldoRestante = calcularSaldoRestante(pagos, prestamo);
        const fechaRegistro = new Date(); // Fecha actual
        const fechaRegistroFormateada = format(fechaRegistro, 'dd-MM-yyyy'); // Formato deseado
    
        return `Estimado/a ${cliente.nombre_completo}, Hemos recibido ${pagosRegistrados.length} pagos registrados el día ${fechaRegistroFormateada}, correspondientes a su crédito del equipo "${prestamo.equipo_a_adquirir}". El monto total registrado es de $${totalPagado.toFixed(2)}. Su saldo restante es de $${saldoRestante}. ¡Gracias por confiar en nosotros!`;
    };

    const handleCloseFinalizarModal = async () => {
        setIsFinalizarModalOpen(false);
        handleClose(); // Cierra el modal de pagos

        // Muestra el modal de éxito
        setIsSuccessModalOpen(true);
    };

    const verificarPagosCompletos = () => {
        return pagos.every((pago) => pago.pagado);
    };

    const handleFinalizarCredito = () => {
        if (verificarPagosCompletos()) {
            setIsFinalizarModalOpen(true);
        } else {
            alert("No puedes marcar el crédito como finalizado porque aún hay pagos pendientes.");
        }
    };

    const calcularMontoRestante = () => {
        // Verificar si el préstamo o los pagos están disponibles y si el arreglo 'pagos' no está vacío
        if (!prestamo || !prestamo.monto_credito || !prestamo.interes || pagos.length === 0) {
            return 0; // o algún valor por defecto si no hay pagos
        }

        // Calculamos el monto total con el interés
        const montoTotal = pagos[0].monto_pago * pagos.length;

        // Calculamos el total pagado
        const totalPagado = pagos
            .filter((pago) => pago.pagado)
            .reduce((suma, pago) => suma + parseFloat(pago.monto_pago), 0);

        // Restamos lo pagado al monto total
        return montoTotal - totalPagado;
    };





    useEffect(() => {
        console.log('Pagos actuales:', pagos);
        console.log('Pagos lengt:', pagos.monto_pago);
    }, [pagos]);

    const handleAction = (action, pagoId = null) => {
        if (pagoId) {
            // Limpia los checkboxes si el pagoId está presente
            setSelectedPagos((prevSelected) => prevSelected.filter((id) => id !== pagoId));
        }
        setCurrentAction(action);
        setCurrentPagoId(pagoId); // Guardar el ID del pago actual
        setConfirmModalOpen(true);
    };


    const handleConfirm = async () => {
        setConfirmModalOpen(false);
    
        try {
            if (currentAction === 'registrarPagos') {
                await Promise.all(selectedPagos.map((pagoId) => registrarPago(pagoId)));
                const pagosActualizados = pagos.map((pago) =>
                    selectedPagos.includes(pago.id) ? { ...pago, pagado: true } : pago
                );
                setPagos(pagosActualizados);
                setSelectedPagos([]);
    
                const pagosRegistrados = pagosActualizados.filter((pago) => selectedPagos.includes(pago.id));
                const mensaje = generarMensajeMultiplesPagos(pagosRegistrados, pagosActualizados, prestamo, cliente);
    
                setMessage(mensaje);
                setSMSModalOpen(true);
    
                // **Actualizar el estado del préstamo**
                await actualizarEstatusPagos(prestamo.id, verificarPagosCompletos() ? 'Finalizado' : 'Activo');
            } else if (currentAction === 'registrarPago') {
                await registrarPago(currentPagoId);
                const pagosActualizados = pagos.map((pago) =>
                    pago.id === currentPagoId ? { ...pago, pagado: true } : pago
                );
                setPagos(pagosActualizados);
    
                const pago = pagosActualizados.find((pago) => pago.id === currentPagoId);
                const mensaje = generarMensajePagoUnico(pago, pagosActualizados, prestamo, cliente);
    
                setMessage(mensaje);
                setSMSModalOpen(true);
    
                // **Actualizar el estado del préstamo**
                await actualizarEstatusPagos(prestamo.id, verificarPagosCompletos() ? 'Finalizado' : 'Activo');
            } else if (currentAction === 'desregistrarPago') {
                // Lógica para desregistrar un pago
                await desregistrarPago(currentPagoId); // Llama a la API para desregistrar
                const pagosActualizados = pagos.map((pago) =>
                    pago.id === currentPagoId ? { ...pago, pagado: false } : pago
                );
                setPagos(pagosActualizados); // Actualiza el estado con los pagos modificados
                alert('Pago desregistrado correctamente.');
    
                // **Actualizar el estado del préstamo**
                await actualizarEstatusPagos(prestamo.id, 'Activo');
            }
        } catch (error) {
            console.error('Error al ejecutar la acción:', error);
            alert('Ocurrió un error al procesar la acción.');
        }
    };
    
    



    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handler = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    const formatFechaPago = (fecha) => {
        const fechaObj = new Date(fecha + 'T00:00:00'); // Asegura que la fecha se interprete en UTC
        return format(fechaObj, 'dd-MM-yyyy'); // Formato de fecha deseado
    };

    const handleCheckboxChange = (pagoId) => {
        if (selectedPagos.includes(pagoId)) {
            setSelectedPagos(selectedPagos.filter((id) => id !== pagoId));
        } else {
            setSelectedPagos([...selectedPagos, pagoId]);
        }
    };

    const handleRegistrarPagos = async () => {
        try {
            await Promise.all(
                selectedPagos.map(async (pagoId) => {
                    await registrarPago(pagoId);
                })
            );

            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    selectedPagos.includes(pago.id) ? { ...pago, pagado: true } : pago
                )
            );

            console.log('Pagos registrados exitosamente:', selectedPagos);
            setSelectedPagos([]); // Limpiar selección después de registrar
            handleClose(); // Cerrar el modal después de registrar
        } catch (error) {
            console.error('Error registrando los pagos:', error);
        }
    };

    const handleRegistrarPagoIndividual = async (pagoId) => {
        try {
            // Limpia los checkboxes antes de registrar
            setSelectedPagos((prevSelected) => prevSelected.filter((id) => id !== pagoId));

            await registrarPago(pagoId);

            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id === pagoId ? { ...pago, pagado: true } : pago
                )
            );
        } catch (error) {
            console.error('Error registrando el pago:', error);
        }
    };


    const handleDesregistrarPago = async (pagoId) => {
        try {
            // Limpia los checkboxes antes de desregistrar
            setSelectedPagos((prevSelected) => prevSelected.filter((id) => id !== pagoId));

            await desregistrarPago(pagoId);

            setPagos((prevPagos) =>
                prevPagos.map((pago) =>
                    pago.id === pagoId ? { ...pago, pagado: false } : pago
                )
            );
        } catch (error) {
            console.error('Error desregistrando el pago:', error);
        }
    };



    return (

        <Dialog size="xl" open={isOpen} handler={handleClose} className="p-4 dark:bg-dark-secondary dark:border-2 dark:border-dark-border">
            <DialogHeader className="relative m-0 block">
                <Typography variant="h4" color="blue-gray" className='dark:text-slider-color'>
                    Cliente: {cliente?.nombre_completo}
                </Typography>
                <Typography className="mt-1 font-normal dark:text-slider-color">
                    Pagos del Préstamo: {prestamo?.equipo_a_adquirir}
                </Typography>
                <Typography className="mt-1 font-small dark:text-slider-color">
                    Monto restante: ${prestamo && prestamo.monto_credito ? calcularMontoRestante().toFixed(2) : '0.00'}
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
            <DialogBody divider className="space-y-4 pb-6 overflow-y-auto max-h-[500px]  ">
                <Card className="h-full w-full overflow-auto  ">
                    <table className="w-full min-w-max table-auto text-left dark:bg-dark-secondary dark:border-2 dark:border-dark-border ">
                        <thead>
                            <tr>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
                                    >
                                        Seleccionar
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
                                    >
                                        Número de Pago
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
                                    >
                                        Fecha de Pago
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
                                    >
                                        Monto
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
                                    >
                                        Estado
                                    </Typography>
                                </th>
                                <th className="p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-bold leading-none dark:text-slider-color"
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
                                            disabled={pago.pagado}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-bold dark:text-slider-color"
                                        >
                                            #{index + 1}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            className="font-normal text-gray-600 dark:text-slider-color"
                                        >
                                            {formatFechaPago(pago.fecha_pago_programada)}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography
                                            variant="small"
                                            className="font-normal text-gray-600 dark:text-slider-color"
                                        >
                                            ${pago.monto_pago}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <div className="w-max">
                                            <Chip
                                                variant={isDarkMode ? 'outlined' : 'ghost'}
                                                size="sm"
                                                value={pago.pagado ? 'Pagado' : 'Pendiente'}
                                                color={pago.pagado ? 'green' : 'amber'}
                                            />
                                        </div>

                                    </td>
                                    <td className="p-4">
                                        {pago.pagado ? (
                                            <Button
                                                size="sm"
                                                color="red"
                                                onClick={() => handleAction('desregistrarPago', pago.id)}
                                            >
                                                Desregistrar Pago
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                color="green"
                                                onClick={() => handleAction('registrarPago', pago.id)}
                                            >
                                                Registrar Pago
                                            </Button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </DialogBody>
            <DialogFooter>
                <Button
                    onClick={() => handleAction('registrarPagos')}
                    disabled={selectedPagos.length === 0}
                    className="mr-4"
                >
                    Registrar Pagos
                </Button>
                <Button
                    color="blue"
                    onClick={handleFinalizarCredito} // Usa la función handleFinalizarCredito
                    disabled={!verificarPagosCompletos()} // Desactiva si no todos los pagos están completos
                    className="mr-4"
                >
                    Finalizar Crédito
                </Button>
                <Button onClick={handleClose}>
                    Cerrar
                </Button>
            </DialogFooter>

            <ConfirmacionModal
                isOpen={confirmModalOpen}
                handleClose={() => setConfirmModalOpen(false)}
                message="¿Estás seguro de realizar esta acción?"
                onConfirm={handleConfirm}
            />
            <SMSModal
                isOpen={SMSModalOpen}
                handleClose={() => setSMSModalOpen(false)}
                prestamoId={prestamo?.id}
                clienteId={cliente?.id}
                mensaje={message} // Pasar el mensaje generado
            />


            <FinalizarCreditoModal
                isOpen={isFinalizarModalOpen}
                handleClose={handleCloseFinalizarModal}
                prestamoId={prestamo?.id}
                pagosCompletos={verificarPagosCompletos()} // Valida si todos los pagos están completos
            />

            {/* Modal de éxito */}
            <Dialog
                open={isSuccessModalOpen}
                handler={() => setIsSuccessModalOpen(false)}
                size="sm"
            >
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Crédito Finalizado
                    </Typography>
                </DialogHeader>
                <DialogBody>
                    <Typography>
                        El crédito para el cliente {cliente?.nombre_completo} ha sido finalizado exitosamente.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={() => setIsSuccessModalOpen(false)}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>



        </Dialog>
    );
};

export default PagosModal;