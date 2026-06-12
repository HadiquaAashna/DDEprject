import React from 'react';
import { motion } from 'framer-motion';
import { Car, Activity, DollarSign, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', traffic: 4000 },
  { name: 'Tue', traffic: 3000 },
  { name: 'Wed', traffic: 2000 },
  { name: 'Thu', traffic: 2780 },
  { name: 'Fri', traffic: 1890 },
  { name: 'Sat', traffic: 2390 },
  { name: 'Sun', traffic: 3490 },
];

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-4 md:p-6 flex items-center gap-3 md:gap-4 hover:border-slate-600 transition-colors cursor-pointer group"
  >
    <div className={`p-3 md:p-4 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6 md:w-8 md:h-8" />
    </div>
    <div>
      <p className="text-xs md:text-sm text-slate-400 font-medium">{title}</p>
      <h3 className="text-xl md:text-2xl font-bold text-slate-200">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Overview</h1>
          <p className="text-sm md:text-base text-slate-400 mt-1">Delhi-Dehradun Expressway Real-time Analytics</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard title="Total Vehicles" value="12,483" icon={Car} color="primary" delay={0.1} />
        <StatCard title="Active Routes" value="5" icon={Activity} color="accent" delay={0.2} />
        <StatCard title="Toll Revenue" value="₹8,49,200" icon={DollarSign} color="emerald" delay={0.3} />
        <StatCard title="Avg Traffic Density" value="High" icon={Users} color="rose" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card p-4 md:p-6"
        >
          <h3 className="text-base md:text-lg font-bold text-slate-200 mb-4 md:mb-6">Traffic Volume Trends</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-4 md:p-6"
        >
          <h3 className="text-base md:text-lg font-bold text-slate-200 mb-4 md:mb-6">Top Busiest Plazas</h3>
          <div className="space-y-4 md:space-y-6">
            {[
              { name: 'Delhi Border Toll', count: 4500, percentage: 85 },
              { name: 'Saharanpur Plaza', count: 3200, percentage: 65 },
              { name: 'Baghpat Entry', count: 2100, percentage: 45 },
              { name: 'Shamli Exit', count: 1800, percentage: 30 },
            ].map((plaza, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs md:text-sm mb-2">
                  <span className="text-slate-300 font-medium">{plaza.name}</span>
                  <span className="text-primary-400 font-bold">{plaza.count}</span>
                </div>
                <div className="h-2 w-full bg-dark-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    style={{ width: `${plaza.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
