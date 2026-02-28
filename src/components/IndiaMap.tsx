import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Info } from 'lucide-react';

const INDIA_CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, aqi: 4, x: '25%', y: '35%' },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777, aqi: 2, x: '15%', y: '65%' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, aqi: 1, x: '25%', y: '85%' },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639, aqi: 3, x: '55%', y: '55%' },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707, aqi: 2, x: '35%', y: '85%' },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, aqi: 2, x: '30%', y: '70%' },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, aqi: 3, x: '10%', y: '50%' },
];

const AQI_COLORS = [
  'bg-emerald-500',
  'bg-yellow-400',
  'bg-orange-500',
  'bg-red-500',
  'bg-purple-600',
];

export const IndiaMap: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">India AQI Hotspots</h2>
          <p className="text-sm text-gray-500">Real-time air quality across major Indian cities</p>
        </div>
        <div className="flex gap-2">
          {AQI_COLORS.map((color, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${color}`} title={`Level ${i+1}`} />
          ))}
        </div>
      </div>

      <div className="relative aspect-[4/5] bg-emerald-50/30 rounded-2xl overflow-hidden border border-emerald-100">
        {/* Simplified India Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <MapPin className="w-64 h-64 text-emerald-900" />
        </div>

        {INDIA_CITIES.map((city, i) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ left: city.x, top: city.y }}
            className="absolute group cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full ${AQI_COLORS[city.aqi - 1]} border-2 border-white shadow-lg animate-pulse`} />
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              <div className="text-xs font-bold">{city.name}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">AQI: {city.aqi}</div>
            </div>
          </motion.div>
        ))}

        <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-black/5 text-[10px] font-medium text-gray-500 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Good (0-50)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" /> Fair (51-100)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> Moderate (101-200)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" /> Poor (201-300)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600" /> Severe (301+)
          </div>
        </div>
      </div>
    </motion.div>
  );
};
