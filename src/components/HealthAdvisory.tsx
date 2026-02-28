import React from 'react';
import { motion } from 'motion/react';
import { Shield, Baby, User, Activity, AlertCircle } from 'lucide-react';
import { HealthAdvisory as HealthAdvisoryType } from '../types';

interface HealthAdvisoryProps {
  advisory: HealthAdvisoryType;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ advisory }) => {
  const groups = [
    { icon: Baby, label: 'Children', text: advisory.advice.children },
    { icon: User, label: 'Elderly', text: advisory.advice.elderly },
    { icon: Activity, label: 'Patients', text: advisory.advice.patients },
    { icon: Shield, label: 'General', text: advisory.advice.general },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, i) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-white rounded-2xl border border-black/5 shadow-sm flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <group.icon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">{group.label}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{group.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-amber-50 rounded-3xl border border-amber-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Recommended Precautions</h3>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {advisory.precautions.map((precaution, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
              {precaution}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
