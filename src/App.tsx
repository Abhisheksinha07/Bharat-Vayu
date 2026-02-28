import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wind, Thermometer, Droplets, Navigation, Info, AlertTriangle, Loader2, MapPin, LayoutDashboard, Map as MapIcon, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { AQIGauge } from './components/AQIGauge';
import { PredictionChart } from './components/PredictionChart';
import { HealthAdvisory } from './components/HealthAdvisory';
import { IndiaMap } from './components/IndiaMap';
import { Guidelines } from './components/Guidelines';
import { ChatBot } from './components/ChatBot';
import { getAQIData, searchCities, getPrediction } from './services/api';
import { AQIData, CityInfo, PredictionPoint, HealthAdvisory as HealthAdvisoryType } from './types';

type View = 'dashboard' | 'indiamap' | 'guidelines';

export default function App() {
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginInput, setLoginInput] = useState<string>('');
  
  const [view, setView] = useState<View>('dashboard');
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [prediction, setPrediction] = useState<{ predictions: PredictionPoint[], confidence: number, analysis: string, healthAdvisory: HealthAdvisoryType } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('bv_user_name');
    if (savedName) {
      setUserName(savedName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.trim()) {
      setUserName(loginInput.trim());
      setIsLoggedIn(true);
      localStorage.setItem('bv_user_name', loginInput.trim());
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('bv_user_name');
    setSelectedCity(null);
  };

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      setIsSearching(true);
      const results = await searchCities(val);
      setCities(results);
      setIsSearching(false);
    } else {
      setCities([]);
    }
  };

  const handleCitySelect = async (city: CityInfo) => {
    setLoading(true);
    setSelectedCity(city);
    setQuery('');
    setCities([]);
    setView('dashboard');
    
    try {
      const data = await getAQIData(city.lat, city.lon);
      setAqiData(data);
      
      const pred = await getPrediction(city.name, data);
      setPrediction(pred);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pollutants = aqiData ? [
    { label: 'PM2.5', value: aqiData.components.pm2_5, unit: 'µg/m³', info: 'Fine particulate matter' },
    { label: 'PM10', value: aqiData.components.pm10, unit: 'µg/m³', info: 'Coarse particulate matter' },
    { label: 'NO₂', value: aqiData.components.no2, unit: 'µg/m³', info: 'Nitrogen dioxide' },
    { label: 'SO₂', value: aqiData.components.so2, unit: 'µg/m³', info: 'Sulfur dioxide' },
    { label: 'CO', value: aqiData.components.co, unit: 'µg/m³', info: 'Carbon monoxide' },
    { label: 'O₃', value: aqiData.components.o3, unit: 'µg/m³', info: 'Ozone' },
  ] : [];

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl border border-black/5 text-center"
      >
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200 mx-auto mb-8">
          <Wind className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tighter mb-2">Welcome to Bharat Vayu</h1>
        <p className="text-gray-500 mb-10">Enter your name to start monitoring air quality.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            Get Started
          </button>
        </form>
      </motion.div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column - Current Stats */}
      <div className="lg:col-span-4 space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="w-5 h-5 text-emerald-600" />
          <h1 className="text-3xl font-bold tracking-tight">{selectedCity?.name}</h1>
          <span className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {selectedCity?.country}
          </span>
        </div>

        {aqiData && <AQIGauge aqi={aqiData.aqi} />}

        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Environment</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Temperature</div>
                <div className="text-lg font-bold">22°C</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">Humidity</div>
                <div className="text-lg font-bold">45%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl shadow-emerald-100 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">AI Analysis</h3>
            <p className="text-sm leading-relaxed opacity-90">
              {prediction?.analysis || "Analyzing local weather patterns and historical pollution trends to provide accurate forecasts."}
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-800 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      {/* Right Column - Detailed Data & Predictions */}
      <div className="lg:col-span-8 space-y-8">
        {/* Pollutants Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {pollutants.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm group hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400">{p.label}</span>
                <Info className="w-3 h-3 text-gray-300 group-hover:text-emerald-500 transition-colors cursor-help" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-bold tracking-tighter">{p.value}</span>
                <span className="text-[10px] text-gray-400 font-medium">{p.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prediction Chart */}
        {prediction && (
          <PredictionChart 
            data={prediction.predictions} 
            confidence={prediction.confidence} 
          />
        )}

        {/* Health Advisory */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Health Advisory
          </h2>
          {prediction?.healthAdvisory && (
            <HealthAdvisory advisory={prediction.healthAdvisory} />
          )}
        </div>
      </div>
    </div>
  );

  const renderLanding = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-12"
      >
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200 mx-auto mb-6">
          <Wind className="text-white w-10 h-10" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-gray-900">Bharat Vayu</h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Welcome back, <span className="text-emerald-600 font-bold">{userName}</span>! AI-powered air quality monitoring and 24-hour forecasting for a healthier tomorrow.
        </p>
      </motion.div>

      <div className="relative w-full max-w-2xl">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter city name to check AQI..."
            className="w-full pl-16 pr-6 py-6 bg-white border-none rounded-3xl shadow-xl shadow-black/5 focus:ring-4 focus:ring-emerald-500/10 transition-all text-lg font-medium"
          />
          {isSearching && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 animate-spin text-emerald-600" />}
        </div>

        <AnimatePresence>
          {cities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden z-50"
            >
              {cities.map((city) => (
                <button
                  key={`${city.lat}-${city.lon}`}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center gap-4 transition-colors border-b border-gray-50 last:border-none"
                >
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-base font-bold">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.state ? `${city.state}, ` : ''}{city.country}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-8 text-sm font-semibold text-gray-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" /> Real-time
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> AI Forecast
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" /> Health Advice
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return renderLogin();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedCity(null)}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Wind className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Bharat Vayu</span>
          </div>

          {/* Centered Nav Links */}
          <div className="flex items-center justify-center gap-1 sm:gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button 
              onClick={() => setView('indiamap')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'indiamap' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden md:block">India Map</span>
            </button>
            <button 
              onClick={() => setView('guidelines')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'guidelines' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:block">Guidelines</span>
            </button>
          </div>

          {/* User & Search */}
          <div className="flex items-center justify-end gap-4">
            <div className="relative w-full max-w-[180px] hidden lg:block">
              {selectedCity && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search city..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs"
                  />
                  {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 animate-spin text-emerald-600" />}
                </div>
              )}

              <AnimatePresence>
                {selectedCity && cities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50"
                  >
                    {cities.map((city) => (
                      <button
                        key={`${city.lat}-${city.lon}`}
                        onClick={() => handleCitySelect(city)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-none"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-semibold">{city.name}</div>
                          <div className="text-[10px] text-gray-500">{city.state ? `${city.state}, ` : ''}{city.country}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-black/5">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-gray-900">{userName}</div>
                <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest">Logout</button>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
            <p className="text-gray-500 font-medium animate-pulse">Analyzing atmospheric data...</p>
          </div>
        ) : (
          <>
            {!selectedCity && renderLanding()}
            {selectedCity && view === 'dashboard' && renderDashboard()}
            {selectedCity && view === 'indiamap' && <IndiaMap />}
            {selectedCity && view === 'guidelines' && <Guidelines />}
          </>
        )}
      </main>

      <ChatBot />

      <footer className="mt-20 border-t border-black/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Wind className="text-white w-5 h-5" />
            </div>
            <span className="font-bold">Bharat Vayu AI</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Bharat Vayu. Powered by Gemini AI & OpenWeather.</p>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
