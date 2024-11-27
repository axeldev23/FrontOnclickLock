import React from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from '@material-tailwind/react';

const ConfirmacionModal = ({ isOpen, handleClose, message, onConfirm }) => {
    return (
        <Dialog open={isOpen} handler={handleClose} size="sm">
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    Confirmación
                </Typography>
            </DialogHeader>
            <DialogBody divider>
                <Typography color="blue-gray">{message}</Typography>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="gradient" color="green" onClick={onConfirm}>
                    Confirmar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmacionModal;
