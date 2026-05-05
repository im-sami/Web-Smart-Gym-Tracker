import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const TopNav = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="md:hidden">
        <h2 className="text-xl font-bold text-primary">Smart Gym</h2>
      </div>
      <div className="hidden md:flex flex-1"></div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-700 hidden sm:block">{currentUser?.name}</span>
        </div>
        <button 
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
