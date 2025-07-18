import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`px-4 py-2 rounded-t ${active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function UserDetailsModal({ user, onClose }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">✕</button>
        <h3 className="text-xl font-bold mb-2">User Details</h3>
        <div><b>Name:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Role:</b> {user.role}</div>
        <div><b>Verified:</b> {user.isVerified ? 'Yes' : 'No'}</div>
        <div><b>Contact:</b> {user.contact || '-'}</div>
        <div className="text-xs text-gray-400 mt-2">ID: {user._id}</div>
      </div>
    </div>
  );
}

function ListingDetailsModal({ listing, onClose }) {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black">✕</button>
        <h3 className="text-xl font-bold mb-2">Listing Details</h3>
        <div><b>Title:</b> {listing.title}</div>
        <div><b>Location:</b> {listing.location}</div>
        <div><b>Price:</b> ₹{listing.price}</div>
        <div><b>Status:</b> {listing.status}</div>
        <div><b>Flagged:</b> {listing.flagged ? 'Yes' : 'No'}</div>
        <div><b>Description:</b> {listing.description}</div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {listing.images?.map((img, i) => (
            <img key={i} src={img} alt="img" className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">ID: {listing._id}</div>
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50 animate-bounce-in">
      {message}
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    Promise.all([
      fetch('https://your-backend-url.onrender.com/api/users').then(r => r.json()),
      fetch('https://your-backend-url.onrender.com/api/listings').then(r => r.json()),
      fetch('https://your-backend-url.onrender.com/api/payments').then(r => r.json()),
    ]).then(([users, listings, payments]) => {
      setUsers(users);
      setListings(listings);
      setPayments(payments);
      setLoading(false);
    });
  }, [user]);

  const handleApprove = async (id) => {
    await fetch(`https://your-backend-url.onrender.com/api/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      body: JSON.stringify({ status: 'active', flagged: false })
    });
    setListings(listings => listings.map(l => l._id === id ? { ...l, status: 'active', flagged: false } : l));
    // Notification placeholder
    setToast('Listing approved and notification sent!');
  };
  const handleReject = async (id) => {
    await fetch(`https://your-backend-url.onrender.com/api/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      body: JSON.stringify({ status: 'rejected' })
    });
    setListings(listings => listings.map(l => l._id === id ? { ...l, status: 'rejected' } : l));
    // Notification placeholder
    setToast('Listing rejected and notification sent!');
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await fetch(`https://your-backend-url.onrender.com/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` }
    });
    setUsers(users => users.filter(u => u._id !== id));
    // Notification placeholder
    setToast('User deleted and notification sent!');
  };
  // Placeholder for edit user (could open a modal with a form)
  const handleEditUser = (user) => {
    alert('Edit user not implemented. User: ' + user.email);
  };

  if (user?.role !== 'admin') return <div className="p-8">Access denied.</div>;

  return (
    <div className="p-8">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="flex gap-2 mb-6">
        <TabButton active={tab === 'users'} onClick={() => setTab('users')}>Users</TabButton>
        <TabButton active={tab === 'listings'} onClick={() => setTab('listings')}>Listings</TabButton>
        <TabButton active={tab === 'payments'} onClick={() => setTab('payments')}>Payments</TabButton>
      </div>
      {loading ? <div>Loading...</div> : (
        <>
          {tab === 'users' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">All Users</h3>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Verified</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2 cursor-pointer underline" onClick={() => setSelectedUser(u)}>{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2">{u.isVerified ? 'Yes' : 'No'}</td>
                      <td className="p-2 flex gap-2">
                        <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handleEditUser(u)}>Edit</button>
                        <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                        <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={() => setSelectedUser(u)}>Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            </div>
          )}
          {tab === 'listings' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">All Listings</h3>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Title</th>
                    <th className="p-2">Seller</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Flagged</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l._id} className="border-t">
                      <td className="p-2 cursor-pointer underline" onClick={() => setSelectedListing(l)}>{l.title}</td>
                      <td className="p-2">{l.seller}</td>
                      <td className="p-2">{l.status}</td>
                      <td className="p-2">{l.flagged ? 'Yes' : 'No'}</td>
                      <td className="p-2 flex gap-2">
                        {l.flagged && l.status !== 'rejected' && (
                          <>
                            <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleApprove(l._id)}>Approve</button>
                            <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleReject(l._id)}>Reject</button>
                          </>
                        )}
                        <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={() => setSelectedListing(l)}>Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ListingDetailsModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
            </div>
          )}
          {tab === 'payments' && (
            <div>
              <h3 className="text-lg font-semibold mb-2">All Payments</h3>
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">User</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id} className="border-t">
                      <td className="p-2">{p.user}</td>
                      <td className="p-2">₹{p.amount}</td>
                      <td className="p-2">{p.status}</td>
                      <td className="p-2">{p.paymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
} 