import './assets/styles/App.css';
import Login from './components/Login';
import AdminstrarCreditos from './components/AdministrarCreditos';
import MultiStepForm from './components/MultiStepForm';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import { useContext } from 'react';
import Layout from './components/Layout';
import EditarCliente from './components/EditarCliente';



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

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
