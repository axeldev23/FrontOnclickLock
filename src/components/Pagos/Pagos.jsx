import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Avatar,
} from '@material-tailwind/react';
import { fetchClientes, fetchPrestamos } from '../../api/api';

const ITEMS_PER_PAGE = 10;

const Pagos = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [filteredPrestamos, setFilteredPrestamos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prestamosData = await fetchPrestamos();
                const clientesData = await fetchClientes();
                setPrestamos(prestamosData);
                setClientes(clientesData);
                setFilteredPrestamos(prestamosData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Pagination logic
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPrestamos = filteredPrestamos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPrestamos.length / ITEMS_PER_PAGE);

    return (
        <Card className="h-full w-full shadow-2xl dark:shadow-custom mb-8 dark:bg-dark-secondary dark:border-2 dark:border-dark-border">
            <CardHeader floated={false} shadow={false} className="rounded-none dark:bg-dark-secondary">
                <div className="mb-8 flex items-center justify-between gap-8 dark:bg-dark-secondary">
                    <div>
                        <Typography variant="h5" color="blue-gray" className="text-left pl-5 pt-5 dark:text-white">
                            Registrar Pagos
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal pl-5 dark:text-slider-color">
                            Selecciona un crédito para registrar pagos
                        </Typography>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 px-7">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Cliente
                                </Typography>
                            </th>
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 px-7">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Equipo
                                </Typography>
                            </th>
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 px-7">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Monto
                                </Typography>
                            </th>
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 px-7">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Estado
                                </Typography>
                            </th>
                            <th className="border-y border-blue-gray-100 bg-blue-gray-50 p-4 px-7">
                                <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                    Acciones
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPrestamos.length > 0 ? (
                            currentPrestamos.map((prestamo, index) => {
                                const cliente = clientes.find((cliente) => cliente.id === prestamo.cliente);

                                return (
                                    <tr key={prestamo.id}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={`https://ui-avatars.com/api/?name=${cliente ? cliente.nombre_completo : 'N/A'}&background=random`}
                                                    alt={cliente ? cliente.nombre_completo : 'N/A'}
                                                    size="sm"
                                                />
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {cliente ? cliente.nombre_completo : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
                                                        {cliente ? cliente.numero_telefono : 'N/A'}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {prestamo.equipo_a_adquirir}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                ${prestamo.monto_credito}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {prestamo.estado}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Button variant="gradient" size="sm">
                                                Seleccionar
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center">
                                    No se encontraron créditos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>
            <div className="flex justify-between p-4">
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Anterior
                </Button>
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Siguiente
                </Button>
            </div>
        </Card>
    );
};

export default Pagos;
