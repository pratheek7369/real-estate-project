import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Toast({ message, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 animate-bounce-in">
      {message}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState(null);
  const handleLogout = () => {
    logout();
    setToast('Logged out!');
  };
  return (
    <div className="p-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="mb-4">Logged in as: <span className="font-semibold">{user?.email}</span></div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-6">Logout</button>
      {user?.role === 'seller' ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Listings</h3>
          <div className="text-gray-500">(Listing management UI will go here...)</div>
        </div>
      ) : (
        <div className="text-gray-500">(Buyer dashboard content will go here...)</div>
      )}
    </div>
  );
} 