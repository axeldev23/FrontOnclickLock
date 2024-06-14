import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  Chip,
  Button,
  Tooltip,
} from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { fetchClientes, fetchPrestamos, updatePrestamo, downloadImage } from '../api/api';
import PaymentSchedulePDF from './PaymentSchedulePDF';
import ContratoCreditoPDF from './ContratoCredito';

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

const AdministrarCreditos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [prestamos, setPrestamos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState([]);
  const [estadoFilter, setEstadoFilter] = useState('ACTIVO');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prestamosData = await fetchPrestamos();
        const clientesData = await fetchClientes();

        // Ordenar los préstamos por fecha de creación en orden ascendente y luego invertirlos
        const sortedPrestamos = prestamosData.sort(
          (a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
        ).reverse();

        setPrestamos(sortedPrestamos);
        setClientes(clientesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterPrestamos = () => {
      const filtered = prestamos.filter((prestamo) => {
        const cliente = clientes.find((cliente) => cliente.id === prestamo.cliente);
        const clienteNombre = cliente ? cliente.nombre_completo.toLowerCase() : '';
        const clienteTelefono = cliente ? cliente.numero_telefono.toLowerCase() : '';
        const claveElector = cliente ? cliente.clave_elector.toLowerCase() : '';
        const equipo = prestamo.equipo_a_adquirir.toLowerCase();
        const term = searchTerm.toLowerCase();
        const estadoMatch = prestamo.estado === estadoFilter;

        return (
          (clienteNombre.includes(term) ||
            clienteTelefono.includes(term) ||
            claveElector.includes(term) ||
            equipo.includes(term)) &&
          estadoMatch
        );
      });
      setFilteredPrestamos(filtered);
    };
    filterPrestamos();
  }, [searchTerm, prestamos, clientes, estadoFilter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEstadoFilterChange = (value) => {
    setEstadoFilter(value);
    setCurrentPage(1); // Reset to the first page when changing the filter
  };

  const handleEstadoChange = async (id, newEstado) => {
    try {
      const updatedPrestamo = await updatePrestamo(id, { estado: newEstado });
      setPrestamos((prevPrestamos) =>
        prevPrestamos.map((prestamo) =>
          prestamo.id === id ? { ...prestamo, estado: newEstado } : prestamo
        )
      );
    } catch (error) {
      console.error('Error updating prestamo estado:', error);
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPrestamos = filteredPrestamos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPrestamos.length / ITEMS_PER_PAGE);

  const TABLE_HEAD = ['Cliente', 'Clave Elector', 'Equipo', 'Monto', 'Estado', 'Acciones'];

  return (
    <Card className="h-full w-full shadow-2xl dark:shadow-custom mb-8 dark:bg-dark-secondary dark:border-2 dark:border-dark-border">
      <CardHeader floated={false} shadow={false} className="rounded-none dark:bg-dark-secondary">
        <div className="mb-8 flex items-center justify-between gap-8 dark:bg-dark-secondary">
          <div className="">
            <Typography variant="h5" color="blue-gray" className="text-left pl-5 pt-5 dark:text-white">
              Administrar Créditos
            </Typography>
            <Typography color="gray" className="mt-1 font-normal pl-5 dark:text-slider-color">
              Ver y gestionar los créditos de los clientes
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
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 dark:bg-dark-border p-4 px-7"
                >
                  <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70 dark:text-white">
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPrestamos.length > 0 ? (
              currentPrestamos.map((prestamo, index) => {
                const cliente = clientes.find((cliente) => cliente.id === prestamo.cliente);
                const isLast = index === currentPrestamos.length - 1;
                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';

                return (
                  <tr key={prestamo.id}>
                    <td className={classes}>
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
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal dark:text-white uppercase">
                        {cliente ? cliente.clave_elector : 'N/A'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal dark:text-white">
                        {prestamo.equipo_a_adquirir}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal dark:text-white">
                        ${prestamo.monto_credito}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant={isDarkMode ? 'outlined' : 'ghost'}
                          size="sm"
                          value={prestamo.estado}
                          color={prestamo.estado === 'ACTIVO' ? 'green' : 'blue-gray'}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex gap-2">
                        <Tooltip content="Editar Cliente">
                          <Button
                            onClick={() => navigate(`/editar-cliente/${cliente.id}`)}
                            className="flex items-center gap-3"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>

                            Editar
                          </Button>
                        </Tooltip>
                        <Tooltip content="Generar Plan de Pagos">
                          <PaymentSchedulePDF prestamoId={prestamo.id} />
                        </Tooltip>
                        <Tooltip content="Generar Formato de compra">
                          <ContratoCreditoPDF prestamoId={prestamo.id} />
                        </Tooltip>

                        {cliente && cliente.foto_identificacion && (
                          <Tooltip content="Descargar Identificación">
                            <Button
                              onClick={() => downloadImage(cliente.id)}
                              className="flex items-center gap-3"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>

                              Identificación
                            </Button>

                          </Tooltip>
                        )}
                        <Tooltip content="Cambiar Estado">
                          <select
                            value={prestamo.estado}
                            onChange={(e) => handleEstadoChange(prestamo.id, e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ml-2 focus:ring-blue-500 focus:border-blue-500 block w-24 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          >
                            <option value="ACTIVO">Activo</option>
                            <option value="FINALIZADO">Finalizado</option>
                          </select>
                        </Tooltip>

                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
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
    </Card>
  );
};

export default AdministrarCreditos;
