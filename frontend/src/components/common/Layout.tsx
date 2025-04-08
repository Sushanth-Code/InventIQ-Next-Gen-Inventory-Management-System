import React, { useState, ReactNode } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-[#F5F8FA]">
      {/* Sidebar */}
      <div className={`bg-[#1E1E2D] text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-[#2B2B40]">
          <h1 className={`font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'}`}>InventiQ</h1>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <span className="material-icons">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
          </button>
        </div>
        
        <nav className="flex-grow py-4">
          <ul>
            <li className="mb-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 ${isActive ? 'bg-[#3699FF] text-white' : 'text-gray-300 hover:bg-[#2B2B40]'}`
                }
              >
                <span className="material-icons mr-3">dashboard</span>
                {isSidebarOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/inventory"
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 ${isActive ? 'bg-[#3699FF] text-white' : 'text-gray-300 hover:bg-[#2B2B40]'}`
                }
              >
                <span className="material-icons mr-3">inventory</span>
                {isSidebarOpen && <span>Inventory</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#2B2B40]">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {isSidebarOpen && (
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            )}
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              <span className="material-icons">logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">InventiQ Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="material-icons text-gray-500">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="material-icons text-gray-500">account_circle</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-[#F5F8FA] p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;