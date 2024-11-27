import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Textarea } from '@material-tailwind/react';
import { enviarSmsPrestamo } from '../../api/api'; // Importar la función para enviar el SMS

const SMSModal = ({ isOpen, handleClose, prestamoId, clienteId, mensaje }) => {
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // Controla el segundo modal
    const [isSending, setIsSending] = useState(false); // Estado para manejar el estado de envío

    const handleSendConfirmation = () => {
        handleClose(); // Cierra el modal de confirmación
        setIsMessageModalOpen(true); // Abre el modal de mensaje
    };

    const handleCloseMessageModal = () => {
        setIsMessageModalOpen(false);
    };

    const handleSendMessage = async () => {
        try {
            setIsSending(true);
            await enviarSmsPrestamo({
                mensaje,
                cliente_id: clienteId,
            });
            alert('Mensaje enviado correctamente al cliente.');
            handleClose(); // Cierra el modal de confirmación
            handleCloseMessageModal(); // Cierra el modal de mensaje
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            alert('Ocurrió un error al enviar el mensaje.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            {/* Modal de confirmación */}
            <Dialog open={isOpen} handler={handleClose} size="sm">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Confirmación por WhatsApp
                    </Typography>
                </DialogHeader>
                <DialogBody divider>
                    <Typography color="blue-gray">
                        ¿Deseas enviar confirmación por WhatsApp al cliente?
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleSendConfirmation}>
                        Sí
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Modal de envío de mensaje */}
            <Dialog open={isMessageModalOpen} handler={handleCloseMessageModal} size="md">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Enviar Mensaje al Cliente
                    </Typography>
                </DialogHeader>
                <DialogBody divider>
                    <Textarea
                        label="Escribe tu mensaje aquí"
                        rows={5}
                        className="focus:ring-0"
                        value={mensaje} // Mostrar el mensaje recibido
                        readOnly // Hacer que el área de texto sea de solo lectura
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleCloseMessageModal}
                        disabled={isSending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleSendMessage}
                        disabled={isSending}
                    >
                        {isSending ? 'Enviando...' : 'Enviar'}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default SMSModal;
