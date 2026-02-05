import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TripCarrier = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const token = localStorage.getItem('token');

  // Existing states for My Trips
  const [showMyTrips, setShowMyTrips] = useState(false);
  const [myTrips, setMyTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // NEW states for Accepted Requests
  const [showAccepted, setShowAccepted] = useState(false);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [acceptedLoading, setAcceptedLoading] = useState(false);
  const [acceptedError, setAcceptedError] = useState('');

  // 🔹 Existing function to fetch My Trips
  const fetchMyTrips = async (pageNumber = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${API_URL}/trips/my-trips?page=${pageNumber}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyTrips(res.data.trips || []);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMyTrips = () => {
    const nextState = !showMyTrips;
    setShowMyTrips(nextState);
    if (!showMyTrips) fetchMyTrips(1);
  };

  // 🔹 Existing Accept/Reject request function
  const handleRequestAction = async (requestId, action) => {
  try {
    await axios.put(
      `${API_URL}/requests/${requestId}/status`,
      { status: action === "accept" ? "accepted" : "rejected" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(`Request ${action}ed successfully`);
    fetchMyTrips(page);

  } catch (err) {
    console.error(`Failed to ${action} request`, err);
    alert(`Failed to ${action} request`);
  }
};


  // 🔹 NEW: Fetch Accepted Requests
  const fetchAcceptedRequests = async () => {
    setAcceptedLoading(true);
    setAcceptedError('');
    try {
      const res = await axios.get(`${API_URL}/requests/accepted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedRequests(res.data.requests || []);
    } catch (err) {
      console.error('Error fetching accepted requests', err);
      setAcceptedError('Failed to load accepted requests');
    } finally {
      setAcceptedLoading(false);
    }
  };

  const handleViewAccepted = () => {
    const nextState = !showAccepted;
    setShowAccepted(nextState);
    if (!showAccepted) fetchAcceptedRequests();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Carrier Dashboard</h1>
        <p className="text-gray-600">Manage your trips and delivery requests</p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/post-trip" 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            🚗 Post New Trip
          </Link>

          <button
            onClick={handleViewMyTrips}
            className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold rounded-lg hover:from-gray-800 hover:to-black transform hover:-translate-y-0.5 transition-all duration-300"
          >
            📋 {showMyTrips ? 'Hide My Trips' : 'View My Trips'}
          </button>

          <button
            onClick={handleViewAccepted}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            ✅ {showAccepted ? 'Hide Accepted Requests' : 'Accepted Requests'}
          </button>
        </div>
      </div>

      {/* MY TRIPS SECTION */}
      {showMyTrips && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">My Trips</h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your trips...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && myTrips.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <p className="text-gray-500">You haven't posted any trips yet.</p>
              <Link 
                to="/post-trip" 
                className="inline-block mt-4 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition duration-200"
              >
                Post Your First Trip
              </Link>
            </div>
          )}

          {myTrips.map((trip) => (
            <div key={trip._id} className="border border-gray-200 rounded-xl p-5 mb-4 hover:bg-gray-50 transition duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📍</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{trip.fromCity} → {trip.toCity}</p>
                      <p className="text-gray-600">{trip.departureDate} | {trip.departureTime}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-blue-700 font-medium">Capacity: {trip.capacity} items</p>
                  </div>
                </div>
              </div>

              {/* REQUESTS */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Delivery Requests</h3>

                {trip.requests?.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-gray-500">No delivery requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trip.requests?.map((req) => (
                      <div
                        key={req._id}
                        className={`border rounded-xl p-4 ${
                          req.status === 'accepted' ? 'border-green-200 bg-green-50' : 
                          req.status === 'rejected' ? 'border-red-200 bg-red-50' : 
                          'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                req.status === 'accepted' ? 'bg-green-100' : 
                                req.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                              }`}>
                                <span className={
                                  req.status === 'accepted' ? 'text-green-600' : 
                                  req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                }>
                                  {req.status === 'accepted' ? '✓' : req.status === 'rejected' ? '✗' : '⏳'}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{req.itemName} ({req.quantity})</p>
                                <p className="text-sm text-gray-600">
                                  ₹{req.price} • Requested by: {req.demanderId?.name || 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {req.status === 'pending' && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleRequestAction(req._id, 'accept')}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                              >
                                Accept
                              </button>

                              <button
                                onClick={() => handleRequestAction(req._id, 'reject')}
                                className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300"
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
          ))}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                disabled={page === 1}
                onClick={() => fetchMyTrips(page - 1)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-600">Page</span>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold">{page}</span>
                <span className="text-gray-600">of {totalPages}</span>
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => fetchMyTrips(page + 1)}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ACCEPTED REQUESTS SECTION */}
      {showAccepted && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Accepted Delivery Requests</h2>
          
          {acceptedLoading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading accepted requests...</p>
            </div>
          )}
          
          {acceptedError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-medium">{acceptedError}</p>
            </div>
          )}

          {!acceptedLoading && acceptedRequests.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-gray-500">No accepted requests yet.</p>
            </div>
          )}

          <div className="space-y-4">
            {acceptedRequests.map((req) => (
              <div key={req._id} className="border border-green-200 rounded-xl p-5 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xl">✅</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{req.itemName} ({req.quantity})</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                            ₹{req.price}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full text-sm">
                            {req.demanderId?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {req.tripId && (
                      <div className="bg-white px-4 py-2 rounded-lg border border-green-200">
                        <p className="font-medium text-gray-800">{req.tripId.fromCity} → {req.tripId.toCity}</p>
                        <p className="text-sm text-gray-600">{req.tripId.departureDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCarrier;