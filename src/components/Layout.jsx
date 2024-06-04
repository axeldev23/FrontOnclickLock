import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div >
        <div className="fixed w-full top-0 left-0 bg-white shadow-md z-10 ">
            <Navbar />
        </div>
        <div className="pt-16">
            {children} 
        </div>
    </div>
  );
}

export default Layout;
