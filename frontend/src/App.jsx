import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import VehicleManagement from './pages/VehicleManagement';
import TollManagement from './pages/TollManagement';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dark-900 text-slate-400">
        <div className="text-lg">Loading Smart Expressway...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-dark-900 text-slate-200 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/vehicles" element={<VehicleManagement />} />
          <Route path="/tolls" element={<TollManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
