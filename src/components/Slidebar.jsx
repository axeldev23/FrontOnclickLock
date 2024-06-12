import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Slidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(1);

  // Update selected tab based on current location
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedTab(1);
        break;
      case '/administrar-creditos':
        setSelectedTab(2);
        break;
      default:
        setSelectedTab(1);
        break;
    }
  }, [location.pathname]);

  const handleTabChange = (tabIndex, path) => {
    setSelectedTab(tabIndex);
    navigate(path);
  };

  return (
    <div className="flex justify-center bg-transparent p-3 rounded-b-lg">
      <div className="relative flex items-center bg-white shadow-md p-3 rounded-full space-x-2">
        <input
          type="radio"
          id="radio-1"
          name="tabs"
          checked={selectedTab === 1}
          onChange={() => handleTabChange(1, '/')}
          className="hidden"
        />
        <label
          htmlFor="radio-1"
          className={`tab flex items-center  justify-center h-8 w-36 text-sm font-medium rounded-full cursor-pointer transition-colors ${
            selectedTab === 1 ? 'text-blue-200' : 'text-black'
          }`}
        >
          Registrar Crédito
        </label>

        <input
          type="radio"
          id="radio-2"
          name="tabs"
          checked={selectedTab === 2}
          onChange={() => handleTabChange(2, '/administrar-creditos')}
          className="hidden"
        />
        <label
          htmlFor="radio-2"
          className={`tab flex items-center justify-center h-8 w-36 text-sm font-medium rounded-full cursor-pointer transition-colors ${
            selectedTab === 2 ? 'text-blue-600' : 'text-black'
          }`}
        >
          Administrar Créditos
        </label>

        <span
          className="glider absolute h-8 w-36 bg-blue-100 rounded-full transition-transform"
          style={{ transform: `translateX(${(selectedTab - 1) * 100}%)` }}
        />
      </div>
    </div>
  );
}
