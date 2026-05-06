import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ShieldAlert, Activity, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const res = await api.get('/reports/system');
        setStats(res.data.data);
      } catch (error) {
        console.error('Error fetching system stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemStats();
  }, []);

  if (loading || !stats) return <div className="p-8">Loading admin dashboard...</div>;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Trainers', value: stats.totalTrainers, icon: Activity, color: 'text-green-500' },
    { label: 'Admins', value: stats.totalAdmins, icon: ShieldAlert, color: 'text-purple-500' },
    { label: 'Recent Workouts (7d)', value: stats.recentWorkouts, icon: BarChart3, color: 'text-orange-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-gray-50 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">System Overview</h2>
        <p className="text-gray-500">More detailed analytics and logs can be placed here in the future. For now, you can manage users from the "Manage Users" tab.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
