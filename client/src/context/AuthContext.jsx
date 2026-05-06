import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (jwtToken) {
        try {
          const res = await api.get('/auth/me');
          setCurrentUser(res.data.data);
          setRole(res.data.data.role);
        } catch (error) {
          console.error('Failed to fetch user', error);
          setJwtToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [jwtToken]);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    const { token, ...user } = res.data.data;
    localStorage.setItem('token', token);
    setJwtToken(token);
    setCurrentUser(user);
    setRole(user.role);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    const { token, ...user } = res.data.data;
    localStorage.setItem('token', token);
    setJwtToken(token);
    setCurrentUser(user);
    setRole(user.role);
    return res.data;
  };

  const updateProfile = async (userData) => {
    const res = await api.put('/auth/me', userData);
    const { token, ...user } = res.data.data;
    if (token) {
      localStorage.setItem('token', token);
      setJwtToken(token);
    }
    setCurrentUser(user);
    setRole(user.role);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setJwtToken(null);
    setCurrentUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, jwtToken, role, login, register, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
