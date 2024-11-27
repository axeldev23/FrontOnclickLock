import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from '@material-tailwind/react';
import { updatePrestamo } from '../../api/api'; // Asegúrate de ajustar la ruta donde está definida la función

const FinalizarCreditoModal = ({ isOpen, handleClose, prestamoId, pagosCompletos }) => {
    const handleConfirm = async () => {
        try {
            // Actualizar el estado del préstamo
            await updatePrestamo(prestamoId, { estado: "FINALIZADO" });
            console.log(`Préstamo con ID ${prestamoId} marcado como FINALIZADO.`);
            handleClose(); // Cerrar el modal después de actualizar
        } catch (error) {
            console.error('Error al finalizar el crédito:', error);
        }
    };

    return (
        <Dialog open={isOpen} handler={handleClose} size="sm">
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    Finalizar Crédito
                </Typography>
            </DialogHeader>
            <DialogBody divider>
                <Typography color="blue-gray">
                    {pagosCompletos
                        ? "¿Deseas marcar este crédito como finalizado?"
                        : "No puedes finalizar el crédito porque aún hay pagos pendientes."}
                </Typography>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose}>
                    No
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    onClick={handleConfirm}
                    disabled={!pagosCompletos} // Desactiva si hay pagos pendientes
                >
                    Sí
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default FinalizarCreditoModal;
