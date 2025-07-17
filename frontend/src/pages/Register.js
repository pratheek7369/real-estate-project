import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // TODO: Replace with your Razorpay key id

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(true); // Always true for testing
  const { register } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }
    
    // Razorpay payment integration
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      name: 'Real Estate App',
      description: 'Buyer Registration Fee',
      handler: function (response) {
        setPaymentSuccess(true);
      },
      prefill: { email, name },
      theme: { color: '#2563eb' },
    };
    
    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Payment initialization failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (role === 'buyer' && !paymentSuccess) {
      setError('Please complete payment to register as a buyer.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, isVerified: role === 'buyer' ? paymentSuccess : true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      register(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        {role === 'buyer' && !paymentSuccess && (
          <button type="button" className="bg-green-600 text-white py-2 rounded font-semibold" onClick={handlePayment}>
            Pay ₹100 Registration Fee
          </button>
        )}
        {role === 'buyer' && paymentSuccess && (
          <div className="text-green-600 text-sm">Payment successful!</div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold">Register</button>
      </form>
    </div>
  );
} 