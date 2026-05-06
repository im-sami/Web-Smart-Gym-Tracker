import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileText, CheckCircle } from 'lucide-react';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/workout-plans');
        setPlans(res.data.data);
      } catch (error) {
        console.error('Error fetching plans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const stats = [
    { label: 'Active Clients', value: new Set(plans.map(p => p.memberId?._id)).size, icon: Users, color: 'text-blue-500' },
    { label: 'Total Plans Created', value: plans.length, icon: FileText, color: 'text-green-500' },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, icon: CheckCircle, color: 'text-primary' },
  ];

  if (loading) return <div className="p-8">Loading trainer dashboard...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Trainer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, idx) => {
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
        <h2 className="text-xl font-bold mb-4">Recent Workout Plans</h2>
        {plans.length === 0 ? (
          <p className="text-gray-500">No workout plans created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-500 font-medium">Title</th>
                  <th className="py-3 px-4 text-gray-500 font-medium">Client</th>
                  <th className="py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="py-3 px-4 text-gray-500 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{plan.title}</td>
                    <td className="py-3 px-4">{plan.memberId?.name || 'Unknown'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' ? 'bg-green-100 text-green-700' :
                        plan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{new Date(plan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
