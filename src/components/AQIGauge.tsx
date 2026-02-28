import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AQIGaugeProps {
  aqi: number;
  className?: string;
}

const AQI_LEVELS = [
  { label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500/20', description: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { label: 'Fair', color: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400/20', description: 'Air quality is acceptable. However, there may be a risk for some people.' },
  { label: 'Moderate', color: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500/20', description: 'Members of sensitive groups may experience health effects.' },
  { label: 'Poor', color: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/20', description: 'Everyone may begin to experience health effects.' },
  { label: 'Very Poor', color: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600/20', description: 'Health warnings of emergency conditions.' },
];

export const AQIGauge: React.FC<AQIGaugeProps> = ({ aqi, className }) => {
  const level = AQI_LEVELS[Math.min(aqi - 1, 4)];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("p-6 rounded-3xl bg-white shadow-sm border border-black/5 flex flex-col items-center text-center", className)}
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={502.6}
            initial={{ strokeDashoffset: 502.6 }}
            animate={{ strokeDashoffset: 502.6 - (502.6 * (aqi / 5)) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={level.text}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tracking-tighter">{aqi}</span>
          <span className="text-xs font-semibold uppercase tracking-widest opacity-50">AQI Index</span>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className={cn("text-2xl font-bold tracking-tight mb-2", level.text)}>
          {level.label}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          {level.description}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-1 w-full max-w-xs">
        {AQI_LEVELS.map((l, i) => (
          <div 
            key={l.label} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i < aqi ? l.color : "bg-gray-100"
            )} 
          />
        ))}
      </div>
    </motion.div>
  );
};
