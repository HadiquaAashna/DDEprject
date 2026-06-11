import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import VehicleManagement from './pages/VehicleManagement';
import TollManagement from './pages/TollManagement';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { AuthContext } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-dark-900 text-slate-200 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 relative">
                  {/* Subtle background decoration */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                  
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/map" element={<MapView />} />
                    <Route path="/vehicles" element={<VehicleManagement />} />
                    <Route path="/tolls" element={<TollManagement />} />
                    <Route path="/analytics" element={<Analytics />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
