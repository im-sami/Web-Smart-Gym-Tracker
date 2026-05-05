import React, { useState, useEffect, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Analytics = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (currentUser) {
          const res = await api.get(`/reports/member/${currentUser._id}`);
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [currentUser]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-2">Track your progress over the last 30 days.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Workout Volume (kg)</h2>
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading chart data...</div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalVolume" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Not enough data yet. Log some workouts!
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Duration Trends (mins)</h2>
          <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalDuration" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorDuration)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-500">No data</div>
          )}
          </div>
        </div>
        
        {/* Placeholder for Edamam API Nutrition */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-2">Quick Nutrition Lookup</h2>
          <p className="text-sm text-gray-500 mb-6">Powered by Edamam Food Database</p>
          <NutritionLookup />
        </div>
      </div>
    </div>
  );
};

const NutritionLookup = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get(`/edamam/nutrition?ingr=${encodeURIComponent(query)}`);
      const parsedData = res.data.data.parsed?.[0]?.food;
      setResult(parsedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 1 apple, 100g chicken..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-xl font-medium"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {result && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-bold text-lg mb-2 capitalize">{result.label || query}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-bold text-gray-900">{Math.round(result.nutrients?.ENERC_KCAL || 0)} kcal</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Protein</p>
              <p className="font-bold text-gray-900">{Math.round(result.nutrients?.PROCNT || 0)}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="font-bold text-gray-900">{Math.round(result.nutrients?.CHOCDF || 0)}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fat</p>
              <p className="font-bold text-gray-900">{Math.round(result.nutrients?.FAT || 0)}g</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
