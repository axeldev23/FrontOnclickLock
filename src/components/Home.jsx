import React, { useContext, useEffect } from 'react';
import Layout from './Layout';
import { AuthContext } from './context/AuthContext';

const Home = () => {
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    console.log("Usuario:", user);
    console.log("Token:", token);
  }, [user, token]);

  return (
    <Layout>
        <h1>Bienvenido a la página de inicio</h1>
        <p>Este es el contenido de la página de inicio.</p>
    </Layout>
  );
}

export default Home;
