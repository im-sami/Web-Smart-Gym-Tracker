import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, PieChart, Users, Settings, Dumbbell, ClipboardList, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

const RoleBasedSidebar = () => {
  const { role } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home, roles: ['member'] },
    { name: 'Workout Logger', path: '/logger', icon: Activity, roles: ['member'] },
    { name: 'Analytics', path: '/analytics', icon: PieChart, roles: ['member', 'trainer', 'admin'] },
    { name: 'Exercises Library', path: '/exercises', icon: Dumbbell, roles: ['member', 'trainer', 'admin'] },
    
    // Trainer Routes
    { name: 'Trainer Dashboard', path: '/trainer', icon: Users, roles: ['trainer', 'admin'] },
    { name: 'Plan Builder', path: '/trainer/plan-builder', icon: ClipboardList, roles: ['trainer', 'admin'] },
    
    // Admin Routes
    { name: 'Admin Dashboard', path: '/admin', icon: ShieldAlert, roles: ['admin'] },
    { name: 'Manage Users', path: '/admin/users', icon: Users, roles: ['admin'] },

    { name: 'Settings', path: '/settings', icon: Settings, roles: ['member', 'trainer', 'admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Smart Gym</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/30" 
                  : "text-gray-500 hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default RoleBasedSidebar;
