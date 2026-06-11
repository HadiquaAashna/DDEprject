import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix Leaflet's default icon path issues with Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const cities = [
  { id: 'delhi', name: 'Delhi', pos: [28.7041, 77.1025] },
  { id: 'baghpat', name: 'Baghpat', pos: [28.9427, 77.2276] },
  { id: 'shamli', name: 'Shamli', pos: [29.4452, 77.3060] },
  { id: 's सहारनपुर', name: 'Saharanpur', pos: [29.9640, 77.5460] },
  { id: 'dehradun', name: 'Dehradun', pos: [30.3165, 78.0322] }
];

const routes = [
  { from: 'delhi', to: 'baghpat', color: '#3b82f6' },
  { from: 'baghpat', to: 'shamli', color: '#3b82f6' },
  { from: 'shamli', to: 's सहारनपुर', color: '#3b82f6' },
  { from: 's सहारनपुर', to: 'dehradun', color: '#3b82f6' },
  { from: 'delhi', to: 's सहारनपुर', color: '#8b5cf6', dashArray: '5, 10' } // Alternate
];

const MapView = () => {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">Interactive Map</h1>
        <div className="flex gap-4">
          <button className="btn-primary">Find Shortest Path</button>
          <button className="btn-primary bg-gradient-to-r from-emerald-600 to-teal-600">Optimize Network (MST)</button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 glass-card overflow-hidden rounded-xl z-0"
      >
        <MapContainer center={[29.5, 77.5]} zoom={8} className="w-full h-full" style={{ background: '#1e293b' }}>
          {/* Using CartoDB Dark Matter for a dark theme map */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {cities.map((city) => (
            <Marker key={city.id} position={city.pos}>
              <Popup className="bg-dark-800 border-none text-white">
                <strong className="text-lg text-primary-500">{city.name}</strong><br />
                Toll Plaza Active
              </Popup>
            </Marker>
          ))}

          {routes.map((route, i) => {
            const fromCity = cities.find(c => c.id === route.from);
            const toCity = cities.find(c => c.id === route.to);
            return (
              <Polyline 
                key={i} 
                positions={[fromCity.pos, toCity.pos]} 
                color={route.color} 
                weight={4}
                dashArray={route.dashArray || null}
              />
            );
          })}
        </MapContainer>
      </motion.div>
    </div>
  );
};

export default MapView;
