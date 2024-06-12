import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { login as loginAPI } from '../api/api';
import { Input } from "@material-tailwind/react";

export default function Login() {
    const { user, login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginAPI(username, password);
            login(data.user, data.token);
        } catch (error) {
            console.error('Error en la autenticación', error);
        }
    };

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handler = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    if (user) {
        return <Navigate to="/" />;
    }

    return (
        <div className='h-screen'>
            <div className="dark:border-b dark:border-dark-border fixed w-full top-0 left-0 shadow-md z-10 py-5 text-3xl font-bold">
                <h1 className={isDarkMode ? 'text-white' : 'text-black'}>Onclick</h1>
            </div>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 content-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <p className={`text-left font-light ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>BIENVENIDO A ONCLICK</p>
                    <h2 className={`text-left text-2xl font-bold leading-9 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                        Inicia sesión
                    </h2>
                    <p className={`text-left mt-2 w-80 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Bienvenido de nuevo. Por favor inicia sesión para continuar</p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Input 
                                label="Nombre de usuario" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mb-4 focus:ring-0 dark:border-slate-200" // Añade clases para foco
                                color={isDarkMode ? "white" : undefined}
                                size='lg'
                            />
                        </div>

                        <div>
                            <div className="mt-2">
                                <Input
                                    type="password"
                                    label="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mb-4 focus:ring-0" // Añade clases para foco
                                    color={isDarkMode ? "white" : undefined}
                                    size='lg'
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
