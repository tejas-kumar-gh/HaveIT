import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ItemDemander from './ItemDemander';
import TripCarrier from './TripCarrier';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState('demander');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuthenticated');

    if (!userData || !isAuth) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white p-4 rounded shadow mb-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}</p>
        </div>

        {/* ROLE SWITCH */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveRole('demander')}
            className={`px-4 py-2 rounded ${
              activeRole === 'demander'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Item Demander
          </button>

          <button
            onClick={() => setActiveRole('carrier')}
            className={`px-4 py-2 rounded ${
              activeRole === 'carrier'
                ? 'bg-blue-600 text-white'
                : 'bg-white border'
            }`}
          >
            Trip Carrier
          </button>
        </div>

        {/* CONTENT */}
        {activeRole === 'demander' && <ItemDemander user={user} />}
        {activeRole === 'carrier' && <TripCarrier />}

        {/* PROFILE */}
        <div className="bg-white p-4 rounded shadow mt-4">
          <h2 className="font-semibold mb-2">Profile</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
