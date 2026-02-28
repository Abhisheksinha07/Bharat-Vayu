import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';

const STANDARDS = [
  { pollutant: 'PM2.5', limit: '60 µg/m³', period: '24 Hours', risk: 'Respiratory issues, lung damage' },
  { pollutant: 'PM10', limit: '100 µg/m³', period: '24 Hours', risk: 'Asthma, bronchitis' },
  { pollutant: 'NO₂', limit: '80 µg/m³', period: '24 Hours', risk: 'Lung inflammation' },
  { pollutant: 'SO₂', limit: '80 µg/m³', period: '24 Hours', risk: 'Throat irritation' },
  { pollutant: 'CO', limit: '4 mg/m³', period: '1 Hour', risk: 'Reduced oxygen delivery' },
  { pollutant: 'O₃', limit: '100 µg/m³', period: '8 Hours', risk: 'Coughing, chest pain' },
];

export const Guidelines: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">National Air Quality Standards</h2>
            <p className="text-sm text-gray-500">Government guidelines for safe pollutant levels (NAAQS India)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Pollutant</th>
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Limit (Avg)</th>
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Time Period</th>
                <th className="pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Health Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {STANDARDS.map((s) => (
                <tr key={s.pollutant} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">{s.pollutant}</td>
                  <td className="py-4 text-sm text-emerald-600 font-mono font-bold">{s.limit}</td>
                  <td className="py-4 text-sm text-gray-500">{s.period}</td>
                  <td className="py-4 text-sm text-gray-500">{s.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold">Public Health Advisory</h3>
          </div>
          <p className="text-sm leading-relaxed opacity-80 mb-6">
            When AQI exceeds 200 (Poor), the government recommends reducing outdoor physical activity, especially for sensitive groups including children and the elderly.
          </p>
          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 hover:text-white transition-colors">
            Read Full Policy <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold">Compliance Reports</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Access monthly and annual reports on air quality compliance across industrial zones and urban centers.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-medium">Annual Report 2025</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-bold">PDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-medium">Industrial Zone Audit</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-bold">PDF</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
