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

    if (!user || user.role !== 'demander') {
      alert('Only item demanders can request delivery');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
            </div>

            {/* Role Switcher */}
            <div className="mt-4 md:mt-0">
              <div className="inline-flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveRole('demander')}
                  className={`px-4 py-2 rounded-md transition-colors ${activeRole === 'demander'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  📦 Item Demander
                </button>
                <button
                  onClick={() => setActiveRole('carrier')}
                  className={`px-4 py-2 rounded-md transition-colors ${activeRole === 'carrier'
                      ? 'bg-secondary text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  🚗 Trip Carrier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Deliveries</p>
            <p className="text-2xl font-bold mt-1">{user?.totalDeliveries || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Rating</p>
            <p className="text-2xl font-bold mt-1">{user?.rating || 0} ⭐</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Account Type</p>
            <p className="text-2xl font-bold mt-1 capitalize">{user?.role || 'User'}</p>
          </div>
        </div>

        {/* Role-Based Dashboard */}
        {activeRole === 'demander' ? (
          // ITEM DEMANDER SECTION
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">📦 Item Demander Dashboard</h2>

            {/* Search for Trips */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search for Available Trips</h3>

              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">From City</label>
                    <input
                      type="text"
                      value={searchQuery.from}
                      onChange={(e) => setSearchQuery({ ...searchQuery, from: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter departure city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">To City</label>
                    <input
                      type="text"
                      value={searchQuery.to}
                      onChange={(e) => setSearchQuery({ ...searchQuery, to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter destination city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Travel Date (Optional)</label>
                    <input
                      type="date"
                      value={searchQuery.date}
                      onChange={(e) => setSearchQuery({ ...searchQuery, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      '🔍 Search Trips'
                    )}
                  </button>

                  {(searchQuery.from || searchQuery.to || searchQuery.date) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery({ from: '', to: '', date: '' });
                        setSearchResults([]);
                        setSearchError('');
                        setRequestedTrips(new Set());
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {/* Error Message */}
              {searchError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {searchError}
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Search Results ({searchResults.length} trips found)
                  </h3>
                  <div className="text-sm text-gray-500">
                    From: {searchQuery.from} → To: {searchQuery.to}
                    {searchQuery.date && ` | Date: ${searchQuery.date}`}
                  </div>
                </div>

                <div className="space-y-4">
                  {searchResults.map(trip => {
                    const availableCapacity = calculateAvailableCapacity(trip);
                    const isRequested = requestedTrips.has(trip._id);
                    const isRequesting = requestingTrip === trip._id;

                    return (
                      <div key={trip._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-3 md:mb-0 md:mr-4">
                            <h4 className="font-bold text-gray-800">
                              {trip.fromCity} → {trip.toCity}
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="flex items-center">
                                <span className="mr-3">📅 {formatDate(trip.departureDate)}</span>
                                <span>🕐 {formatTime(trip.departureTime)}</span>
                              </div>
                              <div className="mt-1">
                                <span className="mr-3">👤 {trip.carrierId?.name || 'Anonymous'}</span>
                                <span>⭐ {trip.carrierId?.rating || 'New'}</span>
                              </div>
                              <div className="mt-1">
                                <span className="mr-3">📦 Capacity: {availableCapacity}/{trip.capacity}</span>
                                {trip.allowedItemTypes && trip.allowedItemTypes.length > 0 && (
                                  <span>✅ Accepts: {trip.allowedItemTypes.slice(0, 2).join(', ')}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            {/* View Details Button */}
                            <button
                              onClick={() => navigate(`/trip/${trip._id}`)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>

                            {/* Request Delivery Button */}
                            {/* Request Delivery Button - FIXED */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRequestDelivery(trip._id);
                              }}
                              disabled={isRequested || isRequesting || availableCapacity <= 0 || user?.role !== 'demander'}
                              className={`px-4 py-2 rounded-md transition-colors font-medium ${isRequested
                                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-blue-700'
                                } ${isRequesting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {isRequesting ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Sending...
                                </div>
                              ) : isRequested ? (
                                '✅ Requested'
                              ) : availableCapacity <= 0 ? (
                                '❌ No Capacity'
                              ) : (
                                '📦 Request Delivery'
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-center">
                  <Link to="/trips" className="text-primary hover:underline">
                    View all available trips →
                  </Link>
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            {(searchQuery.from || searchQuery.to || searchQuery.date || searchResults.length > 0) && !searchLoading && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSearchQuery({ from: '', to: '', date: '' });
                    setSearchResults([]);
                    setSearchError('');
                    setRequestedTrips(new Set());
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                >
                  ✕ Clear All Filters
                </button>
              </div>
            )}

            {/* No Results Message (when search was performed but no results) */}
            {searchResults.length === 0 && searchQuery.from && searchQuery.to && !searchLoading && !searchError && (
              <div className="bg-white rounded-lg shadow p-5 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">🚗</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-4">
                  No trips available from {searchQuery.from} to {searchQuery.to}
                  {searchQuery.date && ` on ${searchQuery.date}`}
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      setSearchQuery({ from: '', to: '', date: '' });
                      setSearchResults([]);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Try Different Search
                  </button>
                  <Link
                    to="/post-request"
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Post Delivery Request Anyway
                  </Link>
                </div>
              </div>
            )}

            {/* Post Request Section (only show if no search or no results) */}
            {(searchResults.length === 0 && !searchQuery.from && !searchQuery.to) && (
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Delivery Request</h3>

                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Need something delivered? Post a delivery request</p>
                  <Link
                    to="/post-request"
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    + Post Delivery Request
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          // CARRIER SECTION
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">🚗 Trip Carrier Dashboard</h2>

            {/* Post Trip Section */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Your Trip</h3>

              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Planning a trip? Share your travel plans to earn money</p>
                <Link
                  to="/post-trip"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  + Post Your Trip
                </Link>
              </div>
            </div>

            {/* Browse Delivery Requests */}
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Browse Delivery Requests</h3>

              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Browse delivery requests from item demanders</p>
                <Link
                  to="/requests"
                  className="inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  🔍 Browse Requests
                </Link>

                <Link
                  to="/my-trips"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors ml-4"
                >
                  📋 View My Trips
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Profile Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">+91 {user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Account Type</p>
              <p className="font-medium capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;