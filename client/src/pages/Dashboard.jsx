import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Activity, Flame, TrendingUp, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
  >
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/workout-logs');
        setRecentLogs(res.data.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching logs', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name}!</h1>
        <p className="text-gray-500 mt-2">Here's a summary of your fitness journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Streak" value="5 Days" icon={Flame} colorClass="bg-orange-100 text-orange-600" delay={0.1} />
        <StatCard title="Total Workouts" value="42" icon={Activity} colorClass="bg-primary/10 text-primary" delay={0.2} />
        <StatCard title="Volume Lifted" value="12.5k kg" icon={TrendingUp} colorClass="bg-emerald-100 text-emerald-600" delay={0.3} />
        <StatCard title="This Week" value="3 / 4" icon={CalendarDays} colorClass="bg-purple-100 text-purple-600" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div key={log._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{new Date(log.date).toLocaleDateString()}</h3>
                    <p className="text-sm text-gray-500">{log.exercises.length} Exercises • {log.durationMinutes || 0} mins</p>
                  </div>
                  <span className="text-primary font-medium">{log.exercises.reduce((acc, curr) => acc + curr.sets.length, 0)} Sets</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity size={40} className="mx-auto text-gray-300 mb-3" />
              <p>No recent workouts found. Time to hit the gym!</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Active Goal Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Monthly Workouts</span>
                <span className="text-primary font-bold">12 / 20</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Squat 1RM</span>
                <span className="text-emerald-500 font-bold">100 / 120 kg</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
