import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import RoleBasedSidebar from '../components/RoleBasedSidebar';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const MainLayout = () => {
  const { jwtToken } = useContext(AuthContext);

  if (!jwtToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <RoleBasedSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
