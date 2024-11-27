import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Typography,
    Button,
    Avatar,
    Spinner,
    Tabs,
    TabsHeader,
    Tab,
    Chip
} from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchClientes, fetchPrestamos, fetchPagosByPrestamo } from '../../api/api';
import PagosModal from './PagosModal'; // Importa el componente modal

const TABS = [
    {
        label: 'Activo',
        value: 'ACTIVO',
    },
    {
        label: 'Finalizado',
        value: 'FINALIZADO',
    },
];

const ITEMS_PER_PAGE = 10;

const Pagos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [prestamos, setPrestamos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [filteredPrestamos, setFilteredPrestamos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // Carga de la tabla
    const [isModalLoading, setIsModalLoading] = useState(false); // Carga exclusiva para el modal
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [estadoFilter, setEstadoFilter] = useState('ACTIVO');
    const [isModalOpen, setIsModalOpen] = useState(false);  // Controla la apertura del modal
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);  // El préstamo seleccionado
    const [pagos, setPagos] = useState([]);  // Los pagos del préstamo seleccionado

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handler = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    const handleEstadoFilterChange = (value) => {
        setEstadoFilter(value);
        setCurrentPage(1);
    };

    // Fetch data para la tabla
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Carga solo para la tabla
            try {
                const prestamosData = await fetchPrestamos();
                const clientesData = await fetchClientes();
                setPrestamos(prestamosData);
                setClientes(clientesData);
                setFilteredPrestamos(prestamosData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Termina la carga de la tabla
            }
        };
        fetchData();
    }, []);

    // Filter data
    useEffect(() => {
        const filterPrestamos = () => {
            const filtered = prestamos.filter((prestamo) => {
                const cliente = clientes.find((cliente) => cliente.id === prestamo.cliente);
                const clienteNombre = cliente ? cliente.nombre_completo.toLowerCase() : '';
                const clienteTelefono = cliente ? cliente.numero_telefono.toLowerCase() : '';
                const equipo = prestamo.equipo_a_adquirir.toLowerCase();
                const estadoMatch = prestamo.estado === estadoFilter;
                const term = searchTerm.toLowerCase();

                return (
                    (clienteNombre.includes(term) ||
                        clienteTelefono.includes(term) ||
                        equipo.includes(term)) &&
                    estadoMatch
                );
            }).sort((a, b) => b.id - a.id);

            setFilteredPrestamos(filtered);
        };

        filterPrestamos();
    }, [searchTerm, prestamos, clientes, estadoFilter]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Función para manejar la selección de un préstamo y abrir el modal
    const handleSelectPrestamo = async (prestamo) => {
        setIsModalLoading(true); // Solo muestra el loading en el modal
        setSelectedPrestamo(prestamo); // Establece el préstamo seleccionado para mostrar los detalles
        try {
            const pagosData = await fetchPagosByPrestamo(prestamo.id);  // Obtén los pagos del préstamo seleccionado
            setPagos(pagosData);
            setIsModalOpen(true);  // Abre el modal
        } catch (error) {
            console.error('Error al obtener los pagos:', error);
        } finally {
            setIsModalLoading(false); // Finaliza el loading en el modal
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPrestamo(null);
        setPagos([]);
    };

    const TABLE_HEAD = ['Cliente', 'Equipo', 'Estado', 'Monto', 'Acciones'];

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
                            Administrar Pagos
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal pl-5 dark:text-slider-color">
                            Aquí puedes administrar los pagos de los clientes.
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row dark:bg-dark-secondary">
                    <Tabs
                        value={estadoFilter}
                        className="w-full md:w-max md:ml-5"
                        onChange={(e) => handleEstadoFilterChange(e)}
                    >
                        <TabsHeader>
                            {TABS.map(({ label, value }) => (
                                <Tab key={value} value={value} onClick={() => handleEstadoFilterChange(value)}>
                                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Tabs>
                    <div className="w-full md:w-96 md:mr-5">
                        <Input
                            label="Buscar"
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="focus:ring-0"
                            color={isDarkMode ? 'white' : undefined}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="relative overflow-scroll px-0">
                {isLoading && (
                    <div className="absolute top-20 left-0 right-0 bottom-0 flex justify-center items-center z-10">
                        <Spinner color="blueGray" size="lg" />
                    </div>
                )}
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 dark:bg-dark-border p-4 px-7">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70 dark:text-white">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {!isLoading && currentPrestamos.length > 0 ? currentPrestamos.map((prestamo) => {
                            const cliente = clientes.find((c) => c.id === prestamo.cliente);
                            return (
                                <tr key={prestamo.id}>
                                    <td className="p-4 border-b border-blue-gray-50">
                                        <div className="flex items-center gap-3 md:pl-4">
                                            <Avatar
                                                src={`https://ui-avatars.com/api/?name=${cliente ? cliente.nombre_completo : 'N/A'}&background=random`}
                                                alt={cliente ? cliente.nombre_completo : 'N/A'}
                                                size="sm"
                                            />
                                            <div className="flex flex-col">
                                                <Typography variant="small" color="blue-gray" className="font-normal dark:text-white">
                                                    {cliente ? cliente.nombre_completo : 'N/A'}
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="font-normal opacity-70 dark:text-white">
                                                    {cliente ? cliente.numero_telefono : 'N/A'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50 font-normal dark:text-white">
                                        {prestamo.equipo_a_adquirir}
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50 font-normal dark:text-white">
                                        <div className='w-max'>
                                            <Chip
                                                variant={isDarkMode ? 'outlined' : 'ghost'}
                                                size="sm"
                                                value={prestamo.estado}
                                                color={prestamo.estado === 'ACTIVO' ? 'green' : 'blue-gray'}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50 font-normal dark:text-white">
                                        ${prestamo.monto_credito}
                                    </td>
                                    <td className="p-4 border-b border-blue-gray-50 font-normal dark:text-white">
                                        <Button onClick={() => handleSelectPrestamo(prestamo)} variant="gradient" size="sm">
                                            Seleccionar
                                        </Button>
                                    </td>
                                </tr>
                            );
                        }) : !isLoading && (
                            <tr>
                                <td colSpan={5} className="p-4 text-center">
                                    No se encontraron créditos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal dark:text-white">
                    Página {currentPage} de {totalPages}
                </Typography>
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        color={isDarkMode ? 'white' : undefined}
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outlined"
                        color={isDarkMode ? 'white' : undefined}
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </CardFooter>

            {/* Componente del modal */}
            <PagosModal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                prestamo={selectedPrestamo}
                pagos={pagos}
                isDarkMode={isDarkMode}
                cliente={clientes.find((c) => c.id === selectedPrestamo?.cliente)}
            />
        </Card>
    );
};

export default Pagos;
