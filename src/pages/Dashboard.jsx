import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setRole } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setRole(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      label: 'View Job History',
      icon: '📋',
      route: '/admin-jobs',
      color: 'bg-indigo-600',
    },
    {
      label: 'Technician Daily Log',
      icon: '📊',
      route: '/admin-report',
      color: 'bg-green-600',
    },
    {
      label: 'Inventory Manager',
      icon: '📦',
      route: '/inventory',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`text-white cursor-pointer px-4 py-3 font-medium flex items-center justify-start ${item.color} rounded-lg shadow hover:opacity-90 transition-opacity`}
            onClick={() => navigate(item.route)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 