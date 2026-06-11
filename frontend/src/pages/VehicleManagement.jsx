import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    ownerName: '',
    vehicleType: 'Car'
  });

  // Since we don't have login wired up in UI, we'll bypass auth token checking on the backend for demo
  // In a real app, you would pass headers: { Authorization: `Bearer ${token}` }

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Mocking data if backend isn't running for the UI demo
      const mockVehicles = [
        { _id: '1', vehicleNumber: 'DL-01-AB-1234', ownerName: 'Rahul Sharma', vehicleType: 'Car', status: 'Active' },
        { _id: '2', vehicleNumber: 'HR-26-CD-5678', ownerName: 'Amit Kumar', vehicleType: 'Truck', status: 'Active' },
        { _id: '3', vehicleNumber: 'UP-14-EF-9012', ownerName: 'Neha Singh', vehicleType: 'Bus', status: 'Inactive' }
      ];
      try {
        const res = await axios.get(`${API_URL}/vehicles`);
        setVehicles(res.data);
      } catch (e) {
        console.warn('Backend not running, using mock data');
        setVehicles(mockVehicles);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      try {
        await axios.post(`${API_URL}/vehicles`, formData);
        fetchVehicles();
      } catch (e) {
        // Fallback to local state if no backend
        const newV = { ...formData, _id: Date.now().toString(), status: 'Active' };
        setVehicles([...vehicles, newV]);
      }
      setIsModalOpen(false);
      setFormData({ vehicleNumber: '', ownerName: '', vehicleType: 'Car' });
    } catch (error) {
      console.error('Error adding vehicle', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      try {
        await axios.delete(`${API_URL}/vehicles/${id}`);
        fetchVehicles();
      } catch (e) {
        setVehicles(vehicles.filter(v => v._id !== id));
      }
    } catch (error) {
      console.error('Error deleting vehicle', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">Vehicle Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-800/50 border-b border-slate-700/50">
              <th className="p-4 text-slate-300 font-medium">Vehicle Number</th>
              <th className="p-4 text-slate-300 font-medium">Owner Name</th>
              <th className="p-4 text-slate-300 font-medium">Type</th>
              <th className="p-4 text-slate-300 font-medium">Status</th>
              <th className="p-4 text-slate-300 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={v._id} 
                className="border-b border-slate-700/20 hover:bg-dark-800/30 transition-colors"
              >
                <td className="p-4 text-slate-200 font-medium">{v.vehicleNumber}</td>
                <td className="p-4 text-slate-400">{v.ownerName}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-dark-900 border ${
                    v.vehicleType === 'Car' ? 'text-primary-400 border-primary-500/30' : 
                    v.vehicleType === 'Truck' ? 'text-orange-400 border-orange-500/30' : 
                    'text-emerald-400 border-emerald-500/30'
                  }`}>
                    {v.vehicleType}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${v.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <span className="text-slate-300">{v.status}</span>
                  </div>
                </td>
                <td className="p-4 flex justify-end gap-3">
                  <button className="p-2 text-slate-400 hover:text-primary-400 transition-colors bg-dark-900 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors bg-dark-900 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-md relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-6 text-slate-200">Register New Vehicle</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Vehicle Number</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. DL-01-AB-1234"
                  className="glass-input w-full"
                  value={formData.vehicleNumber}
                  onChange={e => setFormData({...formData, vehicleNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Owner Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Full Name"
                  className="glass-input w-full"
                  value={formData.ownerName}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Vehicle Type</label>
                <select 
                  className="glass-input w-full text-slate-200 bg-dark-900"
                  value={formData.vehicleType}
                  onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                >
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                  <option value="Bus">Bus</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="LCV">LCV</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Save Vehicle</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
