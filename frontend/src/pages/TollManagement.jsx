import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ArrowRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';

const TollManagement = () => {
  const [plazas, setPlazas] = useState([]);
  const [selectedPlaza, setSelectedPlaza] = useState(null);

  useEffect(() => {
    fetchPlazas();
  }, []);

  const fetchPlazas = async () => {
    try {
      const mockPlazas = [
        { _id: 'p1', name: 'Delhi Border Toll', rates: { Car: 50, Truck: 150, Bus: 125, Motorcycle: 25, LCV: 75 } },
        { _id: 'p2', name: 'Baghpat Entry Toll', rates: { Car: 70, Truck: 210, Bus: 175, Motorcycle: 35, LCV: 105 } },
        { _id: 'p3', name: 'Shamli Exit Toll', rates: { Car: 80, Truck: 240, Bus: 200, Motorcycle: 40, LCV: 120 } }
      ];
      try {
        const res = await axios.get(`${API_URL}/tolls/plazas`);
        setPlazas(res.data.length > 0 ? res.data : mockPlazas);
      } catch (e) {
        setPlazas(mockPlazas);
      }
    } catch (error) {
      console.error('Error fetching plazas:', error);
    }
  };

  const recordToll = async (plazaId, amount) => {
    try {
      alert(`Toll of ₹${amount} recorded for a vehicle at this plaza.`);
      // In a real app we'd send a POST to /api/tolls/record
    } catch (error) {
      console.error('Error recording toll:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">Toll Plazas Network</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {plazas.map((plaza, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={plaza._id} 
              className={`glass-card p-6 cursor-pointer border-2 transition-all ${selectedPlaza?._id === plaza._id ? 'border-primary-500 bg-primary-500/5' : 'border-transparent hover:border-slate-600'}`}
              onClick={() => setSelectedPlaza(plaza)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-dark-900 rounded-full text-accent-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-200">{plaza.name}</h3>
                    <p className="text-sm text-slate-400">Status: Operational • Gates: 8</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          {selectedPlaza ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-slate-200 mb-6">{selectedPlaza.name} Details</h3>
              
              <div className="space-y-4 mb-8">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Toll Rates (₹)</h4>
                {Object.entries(selectedPlaza.rates || {}).map(([type, rate]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg">
                    <span className="text-slate-300">{type}</span>
                    <span className="font-bold text-primary-400">₹{rate}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => recordToll(selectedPlaza._id, selectedPlaza.rates?.Car || 50)}
                className="w-full btn-primary flex justify-center items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Simulate Pass (Car)
              </button>
            </motion.div>
          ) : (
            <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center min-h-[300px]">
              <MapPin className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-400">Select a toll plaza from the list to view details and simulate traffic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TollManagement;
