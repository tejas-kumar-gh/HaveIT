import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TripResponses = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchTripAndRequests();
  }, [tripId]);

  const fetchTripAndRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch trip details
      const tripResponse = await axios.get(`${API_URL}/trips/${tripId}`, {
        withCredentials: true
      });
      setTrip(tripResponse.data);
      
      // Fetch requests
      const requestsResponse = await axios.get(`${API_URL}/requests/trip/${tripId}`, {
        withCredentials: true
      });
      setRequests(requestsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleStatusUpdate = async (requestId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this request?`)) {
      return;
    }

    try {
      await axios.put(`${API_URL}/requests/${requestId}/status`, {
        status: status
      }, {
        withCredentials: true
      });
      
      // Refresh requests
      fetchTripAndRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading responses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/my-trips" className="text-primary hover:underline">
            ← Back to My Trips
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-800">Delivery Requests</h1>
            {trip && (
              <p className="text-gray-600 mt-1">
                For trip: <span className="font-medium">{trip.fromCity} → {trip.toCity}</span>
                <span className="ml-4 text-sm text-gray-500">
                  Capacity: {trip.capacity - (trip.totalDeliveredItems || 0)}/{trip.capacity}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Requests</p>
            <p className="text-2xl font-bold mt-1">{requests.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Accepted</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {requests.filter(r => r.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Requests</h2>
          </div>
          
          {requests.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No requests yet</h3>
              <p className="text-gray-600">No one has requested delivery for this trip yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map(request => (
                <div key={request._id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                    <div className="flex-1 mb-4 lg:mb-0 lg:mr-6">
                      {/* Status Badge */}
                      <div className="flex items-center mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          Requested on {formatDate(request.createdAt)}
                        </span>
                      </div>
                      
                      {/* Demander Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {request.demanderId?.name || 'Anonymous'}
                          </h3>
                          <div className="text-gray-600 mt-1">
                            <span className="mr-4">📧 {request.email}</span>
                            <span>📱 {request.phone}</span>
                          </div>
                          {request.demanderId?.rating && (
                            <div className="mt-1">
                              <span className="text-gray-600">Rating: ⭐ {request.demanderId.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Item Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Item Details</p>
                            <p className="font-medium">{request.itemName}</p>
                            <p className="text-gray-600 text-sm">Type: {request.itemType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Quantity & Price</p>
                            <p className="font-medium">Quantity: {request.quantity}</p>
                            <p className="text-gray-600 text-sm">Price: {formatPrice(request.price)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'accepted')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripResponses;