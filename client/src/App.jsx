import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import WorkoutLogger from './pages/WorkoutLogger';
import Analytics from './pages/Analytics';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { jwtToken } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!jwtToken ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!jwtToken ? <Signup /> : <Navigate to="/" />} />
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="logger" element={<WorkoutLogger />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings Page (Coming Soon in Phase 2)</div>} />
        <Route path="clients" element={<div className="p-8 text-center text-gray-500">Clients Page (Coming Soon in Phase 2)</div>} />
      </Route>
    </Routes>
  );
};

export default App;
