import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <Link to="/admin-jobs" className="block bg-indigo-600 text-white py-2 px-4 rounded mb-2">
        📋 View Job History
      </Link>

      <Link to="/inventory" className="block bg-blue-600 text-white py-2 px-4 rounded">
        📦 Inventory Manager
      </Link>
    </div>
  );
} 