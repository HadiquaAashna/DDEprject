import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const vehicleTypeData = [
  { name: 'Car', value: 4500, color: '#3b82f6' },
  { name: 'Truck', value: 2100, color: '#f59e0b' },
  { name: 'Bus', value: 1800, color: '#10b981' },
  { name: 'Motorcycle', value: 3200, color: '#8b5cf6' },
  { name: 'LCV', value: 900, color: '#ec4899' },
];

const revenueData = [
  { month: 'Jan', Cars: 4000, Trucks: 8000, Buses: 5000 },
  { month: 'Feb', Cars: 3000, Trucks: 9000, Buses: 4000 },
  { month: 'Mar', Cars: 5000, Trucks: 10000, Buses: 6000 },
  { month: 'Apr', Cars: 4500, Trucks: 11000, Buses: 5500 },
  { month: 'May', Cars: 6000, Trucks: 12000, Buses: 7000 },
  { month: 'Jun', Cars: 5500, Trucks: 10500, Buses: 6500 },
];

const congestionData = [
  { time: '00:00', density: 10 },
  { time: '04:00', density: 5 },
  { time: '08:00', density: 85 },
  { time: '12:00', density: 40 },
  { time: '16:00', density: 60 },
  { time: '20:00', density: 90 },
  { time: '23:59', density: 30 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Deep Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-slate-200 mb-6">Monthly Revenue by Vehicle Type (₹k)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Trucks" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Buses" stackId="a" fill="#10b981" />
                <Bar dataKey="Cars" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vehicle Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-slate-200 mb-6">Vehicle Type Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 24h Congestion Line Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="text-lg font-bold text-slate-200 mb-6">24h Traffic Density Index</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={congestionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="density" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
