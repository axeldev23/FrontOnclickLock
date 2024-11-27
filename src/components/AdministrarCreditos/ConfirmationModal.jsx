import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';

const ConfirmationModal = ({ open, onClose, onConfirm, actionType }) => {
  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Confirmación</DialogHeader>
      <DialogBody>
        <Typography variant="body1">
          {actionType === 'ACTIVO_TO_FINALIZADO' ? (
            <span>
              Todos los pagos de este crédito se marcarán como "Pagados". ¿Estás seguro de que deseas continuar?
            </span>
          ) : (
            <span>
              Todos los pagos de este crédito se marcarán como "Pendientes". ¿Estás seguro de que deseas continuar?
            </span>
          )}
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="gradient" color="green" onClick={onConfirm}>
          Confirmar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationModal;
