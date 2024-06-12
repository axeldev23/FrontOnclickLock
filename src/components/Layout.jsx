import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Outlet as PageContent } from 'react-router-dom';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);

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

  const handleNavigateToProfile = () => {
    window.location.href='https://gestionprestamos-server.onrender.com/admin/';
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div>
      <div id='navbar' className="dark:border-b dark:border-dark-border fixed z-50 w-full top-0 left-0 shadow-md z-10 py-3 px-4 dark:bg-dark-background bg-white">
        <div className="grid grid-cols-3 items-center">
          <div></div>
          <h1 className="text-3xl font-bold text-center text-black dark:text-white">Onclick</h1>
          <div className="flex justify-end">
            <div ref={popupRef} className="relative">
              <div className="popup">
                <input
                  type="checkbox"
                  checked={isPopupOpen}
                  onChange={() => setIsPopupOpen(!isPopupOpen)}
                  className="hidden"
                />
                <div
                  tabIndex="0"
                  className="burger"
                  onClick={() => setIsPopupOpen(!isPopupOpen)}
                >
                  <UserCircleIcon className="h-8 w-8 text-white" />
                </div>
                {isPopupOpen && (
                  <nav className="popup-window">
                    <ul>
                      <li>
                        <button onClick={handleNavigateToProfile}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 4v6.406l-3.753 3.741-6.463-6.462 3.7-3.685h6.516zm2-2h-12.388l1.497 1.5-4.171 4.167 9.291 9.291 4.161-4.193 1.61 1.623v-12.388zm-5 4c.552 0 1 .449 1 1s-.448 1-1-1-1-.449-1-1 .448-1 1-1zm0-1c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm6.708.292l-.708.708v3.097l2-2.065-1.292-1.74zm-12.675 9.294l-1.414 1.414h-2.619v2h-2v2h-2v-2.17l5.636-5.626-1.417-1.407-6.219 6.203v5h6v-2h2v-2h2l1.729-1.729-1.696-1.685z"
                            ></path>
                          </svg>
                          <span>Panel de Administrador</span>
                        </button>
                      </li>
                      <li>
                        <button onClick={logout}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.598 9h-1.055c1.482-4.638 5.83-8 10.957-8 6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5c-5.127 0-9.475-3.362-10.957-8h1.055c1.443 4.076 5.334 7 9.902 7 5.795 0 10.5-4.705 10.5-10.5s-4.705-10.5-10.5-10.5c-4.568 0-8.459 2.923-9.902 7zm12.228 3l-4.604-3.747.666-.753 6.112 5-6.101 5-.679-.737 4.608-3.763h-14.828v-1h14.826z"
                            ></path>
                          </svg>
                          <span>Cerrar sesión</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-24">
        <div className="flex justify-center bg-transparent p-3 rounded-b-lg">
          <div className="relative flex items-center bg-slider-color shadow-md p-0 rounded-full space-x-2">
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
              className={`tab flex items-center z-10 justify-center h-8 w-36 text-sm  font-medium rounded-full cursor-pointer transition-colors ${selectedTab === 1 ? 'text-white' : 'text-black'
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
              className={`tab flex items-center z-10 justify-center h-8 w-36 text-sm font-medium rounded-full cursor-pointer transition-colors ${selectedTab === 2 ? 'text-white' : 'text-black'
                }`}
            >
              Administrar Créditos
            </label>

            <span
              className="glider absolute h-8 w-40 bg-slider-color-button rounded-full transition-transform "
              style={{ transform: `translateX(${(selectedTab - 1.06) * 91}%)` }}
            />
          </div>
        </div>
      </div>

      <div className='mt-4 '>
        <PageContent />

      </div>
    </div>
  );
}

export default Layout;
