import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Car, MapPin, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Map', path: '/map', icon: Map },
  { name: 'Vehicles', path: '/vehicles', icon: Car },
  { name: 'Toll Plazas', path: '/tolls', icon: MapPin },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const Sidebar = () => {
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
    </motion.aside>
  );
};

export default Sidebar;
