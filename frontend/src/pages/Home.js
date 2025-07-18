import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all listings for autocomplete
    fetch('https://real-estate-backend-eeot.onrender.com/api/listings')
      .then(res => res.json())
      .then(data => {
        // Build unique suggestions from title, location, country
        const all = Array.from(new Set(data.flatMap(l => [l.title, l.location, ...(l.location.split(',').length > 1 ? [l.location.split(',').slice(-1)[0].trim()] : [])]).filter(Boolean)));
        setSuggestions(all);
      });
  }, []);

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setFilteredSuggestions(suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 8));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/listings');
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center z-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-900 drop-shadow mb-4">Find Your Dream Home</h1>
        <p className="text-xl sm:text-2xl text-blue-700 mb-8 max-w-2xl">Browse verified listings, connect with trusted sellers, and make your next move with confidence.</p>
        <form className="flex flex-wrap gap-3 justify-center w-full max-w-2xl mb-6 relative" onSubmit={handleSearch} autoComplete="off">
          <div className="relative w-full max-w-lg">
            <input
              className="flex-1 min-w-[180px] p-3 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black placeholder-gray-500 w-full"
              placeholder="Search by city, area, or project"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => searchTerm && setShowSuggestions(true)}
              autoComplete="off"
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-blue-200 rounded-lg shadow z-30 mt-1 max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-bold shadow transition">Search</button>
        </form>
        <div className="flex gap-4 flex-wrap justify-center mt-2">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow">Buy</span>
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow">Sell</span>
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold shadow">Rent</span>
        </div>
      </section>
      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 z-20 relative">
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <img src="https://img.icons8.com/color/96/000000/checked--v2.png" alt="Verified" className="w-16 h-16 mb-2" />
          <h3 className="text-xl font-bold text-blue-700 mb-1">Verified Listings</h3>
          <p className="text-gray-600">All properties are verified for authenticity and quality.</p>
        </div>
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <img src="https://img.icons8.com/color/96/000000/handshake.png" alt="Trusted Sellers" className="w-16 h-16 mb-2" />
          <h3 className="text-xl font-bold text-blue-700 mb-1">Trusted Sellers</h3>
          <p className="text-gray-600">Connect with experienced and reliable property owners and agents.</p>
        </div>
        <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <img src="https://img.icons8.com/color/96/000000/online-payment--v2.png" alt="Secure Payments" className="w-16 h-16 mb-2" />
          <h3 className="text-xl font-bold text-blue-700 mb-1 flex items-center gap-2">Secure Payments <img src='https://img.icons8.com/fluency/48/lock-2.png' alt='secure' className='w-6 h-6 inline' /></h3>
          <p className="text-gray-600">Transact safely with our secure and transparent payment system.</p>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-gray-700 italic mb-2">“I found my dream home in just a few days. The process was smooth and transparent!”</p>
            <span className="font-bold text-blue-700">Amit S.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-gray-700 italic mb-2">“As a seller, I could list my property easily and got genuine buyers quickly.”</p>
            <span className="font-bold text-blue-700">Priya K.</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-16 h-16 rounded-full mb-2" />
            <p className="text-gray-700 italic mb-2">“The support team was very helpful and answered all my questions.”</p>
            <span className="font-bold text-blue-700">Rahul M.</span>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <img src="https://img.icons8.com/color/48/000000/home--v2.png" alt="Logo" className="w-8 h-8" />
            <span className="font-extrabold text-xl tracking-tight">Bimba Vinimaya</span>
          </div>
          <div className="flex gap-6 text-blue-100">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#" className="hover:text-white transition">Listings</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook"><img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#" aria-label="Twitter"><img src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="Twitter" className="w-6 h-6" /></a>
            <a href="#" aria-label="Instagram"><img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram" className="w-6 h-6" /></a>
          </div>
        </div>
        <div className="text-center text-blue-200 text-xs mt-4">&copy; {new Date().getFullYear()} Bimba Vinimaya. All rights reserved.</div>
      </footer>
    </div>
  );
} 