import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  return (
    <Router>
      {/* Modern Sticky Navbar */}
      <nav className="bg-white/90 backdrop-blur shadow-lg sticky top-0 z-30 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl text-blue-700 tracking-tight hover:text-blue-900 transition">
              <img src="https://img.icons8.com/color/48/000000/home--v2.png" alt="Logo" className="w-8 h-8" />
              <span>Bimba Vinimaya</span>
            </Link>
            <Link to="/listings" className="font-semibold text-blue-600 hover:text-blue-800 transition">Listings</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-semibold text-blue-600 hover:text-blue-800 transition">Admin</Link>
            )}
          </div>
          <div className="flex gap-4 items-center">
            {!user && <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition">Login</Link>}
            {!user && <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition">Register</Link>}
            {user && <Link to="/dashboard" className="font-semibold text-blue-600 hover:text-blue-800 transition">Dashboard</Link>}
            <Link to="/listings" className="ml-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-full font-bold shadow transition hidden sm:inline-block">Find Properties</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
