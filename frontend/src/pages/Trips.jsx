import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Trips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    fromCity: '',
    toCity: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/trips`, {
        params: filters,
        withCredentials: true
      });
      setTrips(response.data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrips(searchFilters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({ ...searchFilters, [name]: value });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Available Trips</h1>
          <p className="text-gray-600">Find travelers going your way</p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Trips</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-2">From City</label>
              <input
                type="text"
                name="fromCity"
                value={searchFilters.fromCity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Departure city"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-2">To City</label>
              <input
                type="text"
                name="toCity"
                value={searchFilters.toCity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Destination city"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                🔍 Search Trips
              </button>
            </div>
          </form>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setSearchFilters({ fromCity: '', toCity: '' });
                fetchTrips();
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Trips List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trips...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => {
              const availableCapacity = calculateAvailableCapacity(trip);
              
              return (
                <div key={trip._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    {/* Route Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {trip.fromCity} → {trip.toCity}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Posted by {trip.carrierId?.name || 'Anonymous'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Capacity</div>
                        <div className="text-xl font-bold text-primary">
                          {availableCapacity}/{trip.capacity}
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-blue-600 text-sm">🚀</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Departure</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(trip.departureDate)} at {formatTime(trip.departureTime)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-green-600 text-sm">🏁</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Arrival</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(trip.arrivalDate)} at {formatTime(trip.arrivalTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Carrier Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 mb-1">
                        <span className="font-medium">Carrier:</span> {trip.carrierId?.name || 'Not specified'}
                      </p>
                      {trip.carrierId?.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span className="text-gray-700">{trip.carrierId.rating}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            ({trip.carrierId.totalDeliveries || 0} deliveries)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Allowed Items */}
                    {trip.allowedItemTypes && trip.allowedItemTypes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-2">Accepts:</p>
                        <div className="flex flex-wrap gap-2">
                          {trip.allowedItemTypes.map((type, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pickup & Drop Locations */}
                    {(trip.pickupLocation || trip.dropLocation) && (
                      <div className="mb-4 text-sm">
                        {trip.pickupLocation && (
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Pickup:</span> {trip.pickupLocation}
                          </p>
                        )}
                        {trip.dropLocation && (
                          <p className="text-gray-600">
                            <span className="font-medium">Drop:</span> {trip.dropLocation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => navigate(`/post-request?trip=${trip._id}`)}
                        className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Request Delivery
                      </button>
                      <button
                        onClick={() => {
                          // Save trip info for later
                          const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
                          savedTrips.push(trip._id);
                          localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
                          alert('Trip saved!');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">🚗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">
              {searchFilters.fromCity || searchFilters.toCity 
                ? 'No trips match your search criteria' 
                : 'No trips available at the moment'
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSearchFilters({ fromCity: '', toCity: '' });
                  fetchTrips();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Clear Search
              </button>
              <Link
                to="/post-trip"
                className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
              >
                Be the first to post a trip
              </Link>
            </div>
          </div>
        )}

        {/* Stats Info */}
        {trips.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Showing {trips.length} trip{trips.length !== 1 ? 's' : ''}</p>
            {searchFilters.fromCity && <p>From: {searchFilters.fromCity}</p>}
            {searchFilters.toCity && <p>To: {searchFilters.toCity}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;