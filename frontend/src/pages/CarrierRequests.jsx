import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CarrierRequests = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/requests/all-request?page=${pageNumber}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRequests(res.data.requests);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, []);

  const updateStatus = async (requestId, status) => {
    setUpdatingId(requestId);
    try {
      await axios.put(
        `${API_URL}/requests/${requestId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests(page);
    } catch (err) {
      alert("Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition duration-200"
          >
            <span className="text-xl">←</span>
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Delivery Requests</h1>
            <p className="text-gray-600">Manage all delivery requests from travelers</p>
          </div>
        </div>

        {/* REQUESTS CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📦</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">All Delivery Requests</h2>
              <p className="text-gray-600">Review and manage incoming delivery requests</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading delivery requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Requests Found</h3>
              <p className="text-gray-600 mb-6">There are no delivery requests at the moment.</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* REQUEST INFO */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            req.status === 'accepted' ? 'bg-green-100' : 
                            req.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            <span className={`${
                              req.status === 'accepted' ? 'text-green-600' : 
                              req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {req.status === 'accepted' ? '✓' : req.status === 'rejected' ? '✗' : '⏳'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg text-gray-800">{req.itemName}</h3>
                              <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                  {req.quantity} units
                                </span>
                                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                                  req.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                  req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {req.status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-700">
                                <span>📍</span>
                                <p className="font-medium">{req.tripId.fromCity} → {req.tripId.toCity}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-600">
                                <span>📅</span>
                                <p>{new Date(req.tripId.departureDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-600">
                                <span>👤</span>
                                <p>Requested by: <span className="font-medium text-gray-700">{req.demanderId.name}</span></p>
                              </div>
                              
                              <div className="flex items-center gap-2 text-gray-600">
                                <span>💰</span>
                                <p>Price: <span className="font-medium text-gray-700">₹{req.price}</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <button
                          onClick={() => navigate(`/trip/${req.tripId._id}?requestId=${req._id}`)}
                          className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-200"
                        >
                          View Full Details
                        </button>

                        {req.status === "pending" && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => updateStatus(req._id, "accepted")}
                              disabled={updatingId === req._id}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              {updatingId === req._id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                'Accept'
                              )}
                            </button>

                            <button
                              onClick={() => updateStatus(req._id, "rejected")}
                              disabled={updatingId === req._id}
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 disabled:opacity-70 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              {updatingId === req._id ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              ) : (
                                'Reject'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-8 border-t border-gray-200">
                  <button
                    disabled={page === 1}
                    onClick={() => fetchRequests(page - 1)}
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
                    onClick={() => fetchRequests(page + 1)}
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6 inline-block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div className="text-left">
                <p className="text-gray-600">Currently showing</p>
                <p className="text-2xl font-bold text-gray-800">{requests.length} requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierRequests;