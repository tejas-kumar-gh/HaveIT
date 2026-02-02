import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState('demander');
  const [searchQuery, setSearchQuery] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [requestingTrip, setRequestingTrip] = useState(null);
  const [requestedTrips, setRequestedTrips] = useState(new Set());

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!userData || !isAuthenticated) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.from.trim() || !searchQuery.to.trim()) {
      setSearchError('Please enter both From and To cities');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const response = await axios.get(`${API_URL}/trips`, {
        params: {
          fromCity: searchQuery.from,
          toCity: searchQuery.to,
          date: searchQuery.date || undefined
        },
        withCredentials: true
      });

      // Filter by available capacity on frontend
      const tripsWithCapacity = response.data.filter(trip => {
        const availableCapacity = calculateAvailableCapacity(trip);
        return availableCapacity > 0;
      });

      setSearchResults(tripsWithCapacity);

      if (tripsWithCapacity.length === 0) {
        setSearchError(
          `No trips found from "${searchQuery.from}" to "${searchQuery.to}"` +
          `${searchQuery.date ? ` on ${searchQuery.date}` : ''}`
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.data?.message) {
        setSearchError(error.response.data.message);
      } else {
        setSearchError('Failed to search trips. Please try again.');
      }
    } finally {
      setSearchLoading(false);
    }
  };
  const handleRequestDelivery = async (tripId) => {
    console.log('🟡 Starting request delivery for trip:', tripId);

    // Debug localStorage
    console.log('🔍 Checking localStorage:');
    console.log('User:', localStorage.getItem('user'));
    console.log('Token:', localStorage.getItem('token'));
    console.log('isAuthenticated:', localStorage.getItem('isAuthenticated'));

   if (!user) {
  alert('Please login first');
  return;
}


    setRequestingTrip(tripId);

    try {
      // Show a simple form for item details
      const itemName = prompt('Enter item name:');
      if (!itemName) {
        setRequestingTrip(null);
        return;
      }

      const itemType = prompt('Enter item type (e.g., documents, electronics, clothing):');
      if (!itemType) {
        setRequestingTrip(null);
        return;
      }

      const quantity = prompt('Enter quantity (number of items):', '1');
      if (!quantity || parseInt(quantity) < 1) {
        alert('Quantity must be at least 1');
        setRequestingTrip(null);
        return;
      }

      const price = prompt('Enter price (₹):');
      if (!price || parseFloat(price) <= 0) {
        alert('Please enter a valid price');
        setRequestingTrip(null);
        return;
      }

      // Get user phone and email from stored user data
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        alert('No authentication token found. Please login again.');
        setRequestingTrip(null);
        return;
      }

      // Prepare request data
      const requestData = {
        tripId,
        itemName,
        itemType,
        quantity: parseInt(quantity),
        phone: userData.phone || '',
        email: userData.email || '',
        price: parseFloat(price)
      };

      console.log('📦 Sending request data:', requestData);
      console.log('🔗 API URL:', `${API_URL}/requests`);
      console.log('🔑 Token present:', !!token);

      // Send request WITH Authorization header
      const response = await axios.post(`${API_URL}/requests`, requestData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send token in header
        }
      });

      console.log('✅ Request successful:', response.data);

      // Mark this trip as requested
      setRequestedTrips(prev => new Set([...prev, tripId]));

      alert('Delivery request sent successfully!');

    } catch (error) {
      console.error('❌ Error requesting delivery:', error);

      // Detailed error logging
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);

        if (error.response.status === 401) {
          alert('Authentication failed. Please login again.');
          localStorage.clear();
          navigate('/login');
        } else {
          alert(`Error: ${error.response.status} - ${error.response.data?.message || 'Request failed'}`);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response from server. Check your network connection and make sure the backend is running.');
      } else {
        console.error('Request setup error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setRequestingTrip(null);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const calculateAvailableCapacity = (trip) => {
    return trip.capacity - (trip.totalDeliveredItems || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
return (
  <div className="min-h-screen bg-gray-100">
    <Navbar />

    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name}</p>
      </div>

      {/* Role Switch */}
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

      {/* DEMANDER */}
      {activeRole === 'demander' && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-3">Search Trips</h2>

          <form onSubmit={handleSearch} className="grid gap-3">
            <input
              type="text"
              placeholder="From city"
              value={searchQuery.from}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, from: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="text"
              placeholder="To city"
              value={searchQuery.to}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, to: e.target.value })
              }
              className="border p-2 rounded"
            />

            <input
              type="date"
              value={searchQuery.date}
              onChange={(e) =>
                setSearchQuery({ ...searchQuery, date: e.target.value })
              }
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchError && (
            <p className="text-red-500 mt-2">{searchError}</p>
          )}
        </div>
      )}

      {/* SEARCH RESULTS */}
      {searchResults.map((trip) => {
        const available = calculateAvailableCapacity(trip);
        const requested = requestedTrips.has(trip._id);

        return (
          <div
            key={trip._id}
            className="bg-white p-4 rounded shadow mb-3"
          >
            <p className="font-medium">
              {trip.fromCity} → {trip.toCity}
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(trip.departureDate)} | {trip.departureTime}
            </p>
            <p className="text-sm">
              Capacity: {available}/{trip.capacity}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => navigate(`/trip/${trip._id}`)}
                className="border px-3 py-1 rounded"
              >
                View
              </button>

              <button
                disabled={requested || available <= 0}
                onClick={() => handleRequestDelivery(trip._id)}
                className={`px-3 py-1 rounded text-white ${
                  requested
                    ? 'bg-gray-400'
                    : 'bg-blue-600'
                }`}
              >
                {requested ? 'Requested' : 'Request'}
              </button>
            </div>
          </div>
        );
      })}

      {/* CARRIER */}
      {activeRole === 'carrier' && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Carrier Actions</h2>

          <div className="flex gap-3">
            <Link
              to="/post-trip"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post Trip
            </Link>

            <Link
              to="/requests"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              View Requests
            </Link>
          </div>
        </div>
      )}

      {/* PROFILE */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <h2 className="font-semibold mb-2">Profile</h2>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Phone: {user?.phone}</p>
      </div>
    </div>
  </div>
);
};

export default Dashboard;