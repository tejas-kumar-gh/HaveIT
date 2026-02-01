import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const itemsPerPage = 5;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!userData || !isAuthenticated) {
      navigate('/login');
    } else {
      fetchMyTrips();
    }
  }, [navigate, currentPage]);

  const fetchMyTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/trips/my-trips`, {
        params: {
          page: currentPage,
          limit: itemsPerPage
        },
        withCredentials: true
      });
      
      setTrips(response.data.trips || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setErrorMessage('Failed to load your trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    setDeletingTrip(tripId);
    try {
      await axios.delete(`${API_URL}/trips/${tripId}`, {
        withCredentials: true
      });
      
      setSuccessMessage('Trip deleted successfully!');
      // Refresh trips list
      fetchMyTrips();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setErrorMessage('Failed to delete trip. Please try again.');
    } finally {
      setDeletingTrip(null);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading && trips.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Posted Trips</h1>
              <p className="text-gray-600 mt-2">Manage your travel plans and delivery requests</p>
            </div>
            <Link
              to="/post-trip"
              className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span className="mr-2">+</span> Post New Trip
            </Link>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <div className="flex items-center">
              <span className="text-lg mr-2">✅</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <div className="flex items-center">
              <span className="text-lg mr-2">❌</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Trips List */}
        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-3xl">🚗</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No trips posted yet</h3>
            <p className="text-gray-600 mb-6">Start sharing your travel plans to earn money by delivering items</p>
            <Link
              to="/post-trip"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span className="mr-2">+</span> Post Your First Trip
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <p className="text-gray-500 text-sm mb-1">Total Trips</p>
                  <p className="text-2xl font-bold">{trips.length}</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-gray-500 text-sm mb-1">Active Trips</p>
                  <p className="text-2xl font-bold text-green-600">
                    {trips.filter(trip => new Date(trip.departureDate) >= new Date()).length}
                  </p>
                </div>
                <div className="text-center p-4">
                  <p className="text-gray-500 text-sm mb-1">Items Delivered</p>
                  <p className="text-2xl font-bold">
                    {trips.reduce((sum, trip) => sum + (trip.totalDeliveredItems || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Trips List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Your Trips</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {trips.map(trip => {
                  const availableCapacity = calculateAvailableCapacity(trip);
                  const isPastTrip = new Date(trip.departureDate) < new Date();
                  
                  return (
                    <div key={trip._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1 mb-4 lg:mb-0 lg:mr-6">
                          {/* Trip Status Badge */}
                          <div className="flex items-center mb-3">
                            {isPastTrip ? (
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                Completed
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Active
                              </span>
                            )}
                            <span className="ml-3 text-sm text-gray-500">
                              Posted on {new Date(trip.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Trip Details */}
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-xl text-gray-800">
                                {trip.fromCity} → {trip.toCity}
                              </h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <span className="mr-4">📅 {formatDate(trip.departureDate)}</span>
                                <span>🕐 {formatTime(trip.departureTime)}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Capacity</p>
                                <p className="font-medium">
                                  <span className={availableCapacity === 0 ? 'text-red-600' : 'text-green-600'}>
                                    {availableCapacity}
                                  </span>
                                  <span className="text-gray-600">/{trip.capacity} items available</span>
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Item Types</p>
                                <p className="font-medium">
                                  {trip.allowedItemTypes && trip.allowedItemTypes.length > 0 
                                    ? trip.allowedItemTypes.join(', ')
                                    : 'Any type'}
                                </p>
                              </div>
                            </div>
                            
                            {(trip.pickupLocation || trip.dropLocation) && (
                              <div className="text-sm text-gray-600">
                                {trip.pickupLocation && (
                                  <p>📍 Pickup: {trip.pickupLocation}</p>
                                )}
                                {trip.dropLocation && (
                                  <p className="mt-1">📍 Drop: {trip.dropLocation}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3 min-w-[200px]">
                          <button
                            onClick={() => navigate(`/trip/${trip._id}/responses`)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center"
                          >
                            <span className="mr-2">📨</span>
                            View Responses
                            {trip.totalDeliveredItems > 0 && (
                              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {trip.totalDeliveredItems}
                              </span>
                            )}
                          </button>
                          
                          {!isPastTrip && (
                            <button
                              onClick={() => navigate(`/edit-trip/${trip._id}`)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
                            >
                              <span className="mr-2">✏️</span>
                              Edit Trip
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteTrip(trip._id)}
                            disabled={deletingTrip === trip._id}
                            className={`px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center justify-center ${
                              deletingTrip === trip._id ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingTrip === trip._id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <span className="mr-2">🗑️</span>
                                Delete Trip
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next →
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="font-bold text-blue-800 mb-3">📈 Trip Statistics</h3>
            <ul className="text-blue-700 space-y-2">
              <li className="flex justify-between">
                <span>Total trips posted:</span>
                <span className="font-medium">{trips.length}</span>
              </li>
              <li className="flex justify-between">
                <span>Upcoming trips:</span>
                <span className="font-medium text-green-600">
                  {trips.filter(trip => new Date(trip.departureDate) >= new Date()).length}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Completed trips:</span>
                <span className="font-medium">
                  {trips.filter(trip => new Date(trip.departureDate) < new Date()).length}
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 mb-3">💡 Tips</h3>
            <ul className="text-green-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check responses regularly to accept delivery requests</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Update trip details if your plans change</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Delete past trips to keep your list organized</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;