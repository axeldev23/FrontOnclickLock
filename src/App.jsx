import './assets/styles/App.css';
import Login from './components/Login';
import AdminstrarCreditos from './components/AdministrarCreditos/AdministrarCreditos';
import MultiStepForm from './components/CotizarCreditos/MultiStepForm';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import { useContext } from 'react';
import Layout from './components/Layout/Layout';
import EditarCliente from './components/AdministrarCreditos/EditarCliente';
import Pagos from './components/Pagos/Pagos';


const PrivateRoute = ({ element }) => {
  const { user, token } = useContext(AuthContext);

  return user && token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
        <Route path="/" element={<PrivateRoute element={<MultiStepForm />} />} />
        <Route path="/administrar-creditos" element={<PrivateRoute element={<AdminstrarCreditos />} />} />
        <Route path="/editar-cliente/:id" element={<EditarCliente />} />
        <Route path="/pagos" element={<PrivateRoute element={<Pagos />} />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
