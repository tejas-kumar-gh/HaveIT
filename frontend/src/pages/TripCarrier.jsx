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
  
  // States for OTP delivery verification
  const [otpInputs, setOtpInputs] = useState({});
  const [verifyingMap, setVerifyingMap] = useState({});

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

  // 🔹 Updated Accept/Reject/Pickup request function
  const handleRequestAction = async (requestId, action) => {
    try {
      let statusValue = action;
      if (action === "accept") statusValue = "accepted";
      if (action === "reject") statusValue = "rejected";

      await axios.put(
        `${API_URL}/requests/${requestId}/status`,
        { status: statusValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Request status updated to '${statusValue}' successfully`);
      fetchMyTrips(page);
    } catch (err) {
      console.error(`Failed to update request`, err);
      alert(err.response?.data?.message || `Failed to update request`);
    }
  };

  // 🔹 Verify Delivery OTP code
  const handleVerifyOTP = async (requestId) => {
    const otp = otpInputs[requestId];
    if (!otp || otp.trim().length !== 6) {
      alert("Please enter a valid 6-digit OTP code");
      return;
    }
    setVerifyingMap(prev => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(
        `${API_URL}/requests/${requestId}/verify-otp`,
        { otp: otp.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delivery verified and completed successfully!");
      setOtpInputs(prev => ({ ...prev, [requestId]: "" }));
      fetchMyTrips(page);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifyingMap(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const renderTimeline = (status) => {
    if (status === 'rejected') {
      return (
        <div className="flex items-center text-red-600 font-semibold gap-2 mt-4 bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
          <span>🚫</span> Request Rejected
        </div>
      );
    }
    const steps = [
      { label: 'Pending', key: 'pending' },
      { label: 'Accepted', key: 'accepted' },
      { label: 'Picked Up', key: 'picked_up' },
      { label: 'Delivered', key: 'delivered' }
    ];
    const currentIndex = steps.findIndex(s => s.key === status);
    return (
      <div className="w-full mt-6 px-2">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 transition-all duration-500 z-0" 
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isActive = idx === currentIndex;
            return (
              <div key={step.key} className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted && !isActive ? '✓' : idx + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  isActive ? 'text-blue-600 font-bold' :
                  isCompleted ? 'text-emerald-600' : 'text-gray-400'
                }`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
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
                        className={`border rounded-xl p-5 mb-4 ${
                          req.status === 'delivered' ? 'border-emerald-200 bg-emerald-50/20' : 
                          req.status === 'picked_up' ? 'border-blue-200 bg-blue-50/20' : 
                          req.status === 'accepted' ? 'border-green-200 bg-green-50/20' : 
                          req.status === 'rejected' ? 'border-red-200 bg-red-50/20' : 
                          'border-yellow-200 bg-yellow-50/20'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="mb-4 md:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                req.status === 'delivered' || req.status === 'picked_up' || req.status === 'accepted' ? 'bg-green-100 text-green-600' : 
                                req.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                <span className="text-lg">
                                  {req.status === 'delivered' ? '✓' : req.status === 'rejected' ? '✗' : '⏳'}
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

                          <div className="flex flex-wrap gap-2">
                            {req.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleRequestAction(req._id, 'accept')}
                                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm shadow-sm cursor-pointer"
                                >
                                  Accept
                                </button>

                                <button
                                  onClick={() => handleRequestAction(req._id, 'reject')}
                                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 text-sm shadow-sm cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {req.status === 'accepted' && (
                              <button
                                onClick={() => handleRequestAction(req._id, 'picked_up')}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm shadow-sm cursor-pointer"
                              >
                                Mark as Picked Up
                              </button>
                            )}

                            {req.status === 'delivered' && (
                              <div className="flex items-center text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                ✓ Delivery Completed
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Render progress timeline */}
                        {renderTimeline(req.status)}

                        {/* Verification form if picked up */}
                        {req.status === 'picked_up' && (
                          <div className="mt-6 border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-bold text-gray-700">🔐 Delivery Handover Verification</p>
                              <p className="text-xs text-gray-500">Ask the demander for the 6-digit OTP code to confirm receipt.</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto items-center">
                              <input
                                type="text"
                                maxLength="6"
                                placeholder="6-digit OTP"
                                value={otpInputs[req._id] || ""}
                                onChange={(e) => setOtpInputs(prev => ({ ...prev, [req._id]: e.target.value }))}
                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm tracking-widest font-mono font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              />
                              <button
                                onClick={() => handleVerifyOTP(req._id)}
                                disabled={verifyingMap[req._id]}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 text-sm shadow-sm disabled:opacity-50 cursor-pointer"
                              >
                                {verifyingMap[req._id] ? "Verifying..." : "Verify OTP"}
                              </button>
                            </div>
                          </div>
                        )}
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