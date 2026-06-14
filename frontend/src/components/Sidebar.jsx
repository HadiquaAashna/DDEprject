import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Car, MapPin, BarChart3, LogOut } from 'lucide-react';
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

  return (
    <>
      {/* Mobile sidebar - horizontal scrollable */}
      <div className="md:hidden w-full glass-card border-t-0 border-l-0 border-r-0 border-b border-slate-700/50 flex flex-col">
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            Smart Expressway
          </h1>
        </div>
        <nav className="flex overflow-x-auto gap-2 p-3 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300 min-w-[80px] ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-slate-400 hover:bg-dark-800 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
          {user && (
            <button
              onClick={logout}
              className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 min-w-[80px] transition-all duration-300"
            >
              <LogOut className="w-6 h-6 text-rose-500" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          )}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="hidden md:flex w-64 glass-card border-l-0 border-y-0 rounded-none rounded-r-2xl flex flex-col z-20"
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
                `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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

        {user && (
          <div className="p-4 border-t border-slate-700/30 mt-auto">
            <div className="flex items-center gap-3 px-4 py-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white uppercase">
                {user.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 text-rose-500" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
};

export default Sidebar;
