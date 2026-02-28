import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface PredictionChartProps {
  data: { time: string; aqi: number }[];
  confidence: number;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data, confidence }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[400px] bg-white p-6 rounded-3xl border border-black/5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight">AI Forecast</h3>
          <p className="text-sm text-gray-500">Predicted AQI for the next 24 hours</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Confidence</div>
          <div className="text-xl font-mono font-bold text-emerald-600">{(confidence * 100).toFixed(1)}%</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            tickFormatter={(str) => format(new Date(str), 'HH:mm')}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px'
            }}
            labelFormatter={(label) => format(new Date(label), 'MMM d, HH:mm')}
          />
          <Area 
            type="monotone" 
            dataKey="aqi" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorAqi)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
