import React from 'react';
import './assets/styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import MultiStepForm from './components/MultiStepForm';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/registrar-credito" element={<ProtectedRoute><MultiStepForm /></ProtectedRoute>} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
