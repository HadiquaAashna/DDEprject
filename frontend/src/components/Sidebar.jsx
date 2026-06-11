import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Car, MapPin, BarChart3, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Map', path: '/map', icon: Map },
  { name: 'Vehicles', path: '/vehicles', icon: Car },
  { name: 'Toll Plazas', path: '/tolls', icon: MapPin },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 glass-card border-l-0 border-y-0 rounded-none rounded-r-2xl flex flex-col z-20"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
          Smart Expressway
        </h1>
        <p className="text-xs text-slate-400 mt-1">Management System</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary-500/10 text-primary-400 shadow-inner'
                  : 'text-slate-400 hover:bg-dark-800 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-slate-500'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full" 
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-2 bg-dark-900/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
