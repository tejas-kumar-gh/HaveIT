import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    itemName: '',
    itemType: '',
    quantity: 1,
    phone: '',
    email: '',
    price: ''
  });
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setRequestData(prev => ({
        ...prev,
        phone: parsedUser.phone || '',
        email: parsedUser.email || ''
      }));
    }
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/trips/${id}`, {
        withCredentials: true
      });
      setTrip(response.data);
      
      // Check if user already requested this trip
      checkIfRequested();
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfRequested = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests/check/${id}`, {
        withCredentials: true
      });
      setIsRequested(response.data.requested);
    } catch (error) {
      console.error('Error checking request:', error);
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

  const calculateAvailableCapacity = () => {
    return trip.capacity - (trip.totalDeliveredItems || 0);
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestData.itemName.trim() || !requestData.itemType.trim() || 
        !requestData.phone.trim() || !requestData.email.trim() || !requestData.price) {
      alert('Please fill all required fields');
      return;
    }

    if (parseInt(requestData.quantity) < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    setRequestLoading(true);
    try {
      await axios.post(`${API_URL}/requests`, {
        tripId: id,
        itemName: requestData.itemName,
        itemType: requestData.itemType,
        quantity: parseInt(requestData.quantity),
        phone: requestData.phone,
        email: requestData.email,
        price: parseFloat(requestData.price)
      }, {
        withCredentials: true
      });
      setIsRequested(true);
      setShowRequestForm(false);
    } catch (error) {
      console.error('Error requesting delivery:', error);
      alert(error.response?.data?.message || 'Failed to request delivery');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trip details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip not found</h2>
            <Link to="/dashboard" className="text-primary hover:underline">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableCapacity = calculateAvailableCapacity();
  const canRequest = user?.role === 'demander' && availableCapacity > 0 && !isRequested;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Trip Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {trip.fromCity} → {trip.toCity}
                </h1>
                <p className="text-blue-100 mt-2">
                  Posted by {trip.carrierId?.name || 'Anonymous'}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-white text-blue-600 px-4 py-2 rounded-full font-bold">
                  {availableCapacity} spots left
                </span>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Departure Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Departure</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Date:</span>
                      <span className="font-medium">{formatDate(trip.departureDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Time:</span>
                      <span className="font-medium">{formatTime(trip.departureTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Arrival Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Arrival</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Date:</span>
                      <span className="font-medium">{formatDate(trip.arrivalDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Time:</span>
                      <span className="font-medium">{formatTime(trip.arrivalTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Capacity</h3>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${(availableCapacity / trip.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-4 font-medium">
                      {availableCapacity}/{trip.capacity} items
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Carrier Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Carrier Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Name:</span>
                      <span className="font-medium">{trip.carrierId?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-32">Rating:</span>
                      <span className="font-medium">⭐ {trip.carrierId?.rating || 'New'}</span>
                    </div>
                    {trip.carrierId?.phone && (
                      <div className="flex items-center">
                        <span className="text-gray-500 w-32">Phone:</span>
                        <span className="font-medium">+91 {trip.carrierId.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Types */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Allowed Item Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.allowedItemTypes && trip.allowedItemTypes.length > 0 ? (
                      trip.allowedItemTypes.map((type, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Any type accepted</span>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Locations</h3>
                  <div className="space-y-2">
                    {trip.pickupLocation && (
                      <div>
                        <span className="text-gray-500">Pickup: </span>
                        <span className="font-medium">{trip.pickupLocation}</span>
                      </div>
                    )}
                    {trip.dropLocation && (
                      <div>
                        <span className="text-gray-500">Drop: </span>
                        <span className="font-medium">{trip.dropLocation}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Request Section */}
        {user?.role === 'demander' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {isRequested ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delivery Request Sent</h3>
                <p className="text-gray-600">Your delivery request has been sent to the carrier.</p>
              </div>
            ) : showRequestForm ? (
              <form onSubmit={handleRequestSubmit}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Delivery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Item Name *</label>
                    <input
                      type="text"
                      name="itemName"
                      value={requestData.itemName}
                      onChange={handleRequestChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Item Type *</label>
                    <input
                      type="text"
                      name="itemType"
                      value={requestData.itemType}
                      onChange={handleRequestChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={requestData.quantity}
                      onChange={handleRequestChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={requestData.price}
                      onChange={handleRequestChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={requestData.phone}
                      onChange={handleRequestChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={requestData.email}
                      onChange={handleRequestChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {requestLoading ? 'Sending...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <button
                  onClick={() => setShowRequestForm(true)}
                  disabled={!canRequest}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
                    canRequest
                      ? 'bg-primary text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  }`}
                >
                  {availableCapacity <= 0 ? '❌ No Capacity Available' : '📦 Request Delivery'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;