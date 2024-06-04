import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from './axiosConfig'; // Ajusta la ruta según corresponda
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            const response = await axiosInstance.post('/api/token/', {
                username,
                password,
            });
            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            setUser({ username });
            navigate('/');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    useEffect(() => {
        const checkUser = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken) {
                try {
                    const response = await axiosInstance.get('/api/me/', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error('Error al validar token:', error);
                    logoutUser();
                }
            }
        };
        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
