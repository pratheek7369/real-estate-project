import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET'; // TODO: Replace with your Cloudinary preset
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // TODO: Replace with your Cloudinary cloud name

function ListingForm({ initial, onSubmit, onClose }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(initial?.price || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [images, setImages] = useState(initial?.images || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) uploaded.push(data.secure_url);
      }
      setImages(prev => [...prev, ...uploaded]);
    } catch (err) {
      setError('Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      setError('All fields are required');
      return;
    }
    setError('');
    await onSubmit({ title, description, price, location, images });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96 flex flex-col gap-3 relative">
        <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">✕</button>
        <h3 className="text-xl font-bold mb-2">{initial ? 'Edit Listing' : 'Create Listing'}</h3>
        <input className="border p-2 rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <textarea className="border p-2 rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="border p-2 rounded" />
        {uploading && <div className="text-blue-500 text-sm">Uploading...</div>}
        <div className="flex gap-2 flex-wrap mb-2">
          {images.map((img, i) => (
            <img key={i} src={img} alt="preview" className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold">{initial ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 animate-bounce-in">
      {message}
    </div>
  );
}

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  // Search/filter state
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Country filter state
  const [country, setCountry] = useState('');

  // Autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Autocomplete for main search bar
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const urlLocation = useLocation();
  const didInitSearch = useRef(false);

  // On mount, pre-fill search and location from query params only once
  useEffect(() => {
    if (!didInitSearch.current) {
      const params = new URLSearchParams(urlLocation.search);
      const searchParam = params.get('search');
      const locationParam = params.get('location');
      if (searchParam) setSearch(searchParam);
      if (locationParam) setLocation(locationParam);
      didInitSearch.current = true;
    }
  }, [urlLocation.search]);

  const fetchListings = () => {
    setLoading(true);
    fetch('https://real-estate-backend-eeot.onrender.com/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchListings(); }, []);

  // Extract unique countries from locations
  const allCountries = Array.from(new Set(listings.map(l => {
    const parts = l.location.split(',');
    return parts.length > 1 ? parts[parts.length - 1].trim() : '';
  }).filter(Boolean)));

  // Unique locations for autocomplete, filtered by country if selected
  const uniqueLocations = Array.from(new Set(listings
    .filter(l => !country || l.location.endsWith(country))
    .map(l => l.location)
  ));

  // Build all possible suggestions from title, location, and description
  const allSearchSuggestions = Array.from(new Set(
    listings.flatMap(l => [l.title, l.location, ...l.description.split(/[,.;]/).map(s => s.trim())])
      .filter(Boolean)
  ));

  // Filtered listings (add country filter)
  const filtered = listings.filter(l => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      l.title.toLowerCase().includes(searchLower) ||
      l.location.toLowerCase().includes(searchLower) ||
      l.description.toLowerCase().includes(searchLower);
    const matchesLocation = location ? l.location.toLowerCase().includes(location.toLowerCase()) : true;
    const matchesMin = minPrice ? Number(l.price) >= Number(minPrice) : true;
    const matchesMax = maxPrice ? Number(l.price) <= Number(maxPrice) : true;
    const matchesCountry = country ? l.location.endsWith(country) : true;
    return matchesSearch && matchesLocation && matchesMin && matchesMax && matchesCountry;
  });

  // Handle location input change for autocomplete
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 0) {
      const filtered = uniqueLocations.filter(loc => loc.toLowerCase().includes(value.toLowerCase()));
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion);
    setShowSuggestions(false);
  };

  // Handle main search input change for autocomplete
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 0) {
      const filtered = allSearchSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSearchSuggestions(filtered.slice(0, 8)); // limit suggestions
      setShowSearchSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  };

  // Handle suggestion click for main search
  const handleSearchSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setShowSearchSuggestions(false);
  };

  const handleCreate = async (fields) => {
    const res = await fetch('https://real-estate-backend-eeot.onrender.com/api/listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`
      },
      body: JSON.stringify(fields)
    });
    if (res.ok) {
      setToast('Listing created!');
      setShowForm(false);
      fetchListings();
    } else {
      setToast('Failed to create listing');
    }
  };

  const handleEdit = async (fields) => {
    const res = await fetch(`https://real-estate-backend-eeot.onrender.com/api/listings/${editListing._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`
      },
      body: JSON.stringify(fields)
    });
    if (res.ok) {
      setToast('Listing updated!');
      setEditListing(null);
      fetchListings();
    } else {
      setToast('Failed to update listing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    const res = await fetch(`https://real-estate-backend-eeot.onrender.com/api/listings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    if (res.ok) {
      setToast('Listing deleted!');
      fetchListings();
    } else {
      setToast('Failed to delete listing');
    }
  };

  return (
    <div className="relative p-4 sm:p-8 max-w-7xl mx-auto min-h-screen overflow-hidden bg-white">
      {/* Removed Dark HD Background Image and overlays */}
      {/* Secure Payment Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-700/90 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm z-20">
        <img src="https://img.icons8.com/fluency/48/lock-2.png" alt="Secure" className="w-5 h-5" />
        Secure Payment
      </div>
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-900 tracking-tight drop-shadow">Browse Listings</h2>
      {/* Seller instructions and Add Property button */}
      {user ? (
        user.role === 'seller' ? (
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-100 border border-blue-300 text-blue-800 rounded-lg px-6 py-3 mb-4 text-center max-w-xl">
              <span className="font-semibold">Are you a seller?</span> <br />
              To add your property, click the <span className="font-bold">Add Your Property</span> button below and fill out the form with your property details and images.
            </div>
            <button
              className="mb-6 bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 transition text-lg font-bold"
              onClick={() => setShowForm(true)}
            >
              + Add Your Property
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8">
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-6 py-3 text-center max-w-xl">
              <span className="font-semibold">Want to add your property?</span> <br />
              Please <span className="font-bold">register or log in as a seller</span> to add listings to the website.
            </div>
          </div>
        )
      ) : null}
      {/* Modern Search/Filter Bar with Country Dropdown and Main Search Autocomplete */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center bg-white rounded-xl shadow-lg p-6 border border-blue-100 relative">
        <select
          className="border-2 border-blue-200 p-3 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={country}
          onChange={e => { setCountry(e.target.value); setLocation(''); setShowSuggestions(false); }}
        >
          <option value="">All Countries</option>
          {allCountries.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>
        <div className="relative w-56">
          <input
            className="border-2 border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search by title, location, or description"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => search && setShowSearchSuggestions(true)}
            autoComplete="off"
          />
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-blue-200 rounded-lg shadow z-30 mt-1 max-h-40 overflow-y-auto">
              {searchSuggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSearchSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative w-56">
          <input
            className="border-2 border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Location"
            value={location}
            onChange={handleLocationChange}
            onFocus={() => location && setShowSuggestions(true)}
            autoComplete="off"
          />
          {showSuggestions && locationSuggestions.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-blue-200 rounded-lg shadow z-20 mt-1 max-h-40 overflow-y-auto">
              {locationSuggestions.map((suggestion, idx) => (
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
        <input
          className="border-2 border-blue-200 p-3 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Min Price"
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
        />
        <input
          className="border-2 border-blue-200 p-3 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Max Price"
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-blue-700 font-semibold text-xl py-12">No listings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map(listing => (
            <div
              key={listing._id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-0 flex flex-col border border-blue-100 group relative overflow-hidden"
            >
              {/* Price badge */}
              <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white px-4 py-1 rounded-full text-lg font-bold shadow-lg">₹{listing.price.toLocaleString()}</div>
              {/* Location tag */}
              <div className="absolute top-4 left-4 z-10 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow">{listing.location}</div>
              {/* Listing image */}
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt="listing"
                  className="w-full h-56 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-t-2xl text-gray-400">No Image</div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-1 text-blue-800 group-hover:text-blue-600 transition-colors">{listing.title}</h3>
                <div className="text-gray-600 mb-2 line-clamp-2 min-h-[48px]">{listing.description}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Verified</span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 text-xs">Listed by Seller</span>
                </div>
                {user?.role === 'seller' && user?._id === listing.seller && (
                  <div className="flex gap-2 mt-2">
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded font-semibold hover:bg-yellow-600 transition" onClick={() => setEditListing(listing)}>Edit</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded font-semibold hover:bg-red-600 transition" onClick={() => handleDelete(listing._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {user?.role === 'seller' && (
        <button className="mt-12 bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 transition text-lg font-bold mx-auto block">Create New Listing</button>
      )}
      {showForm && <ListingForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editListing && <ListingForm initial={editListing} onSubmit={handleEdit} onClose={() => setEditListing(null)} />}
    </div>
  );
} 