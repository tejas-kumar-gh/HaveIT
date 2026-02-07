import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ItemDemander = ({ user }) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const saved = location.state?.itemDemanderState;

  const [searchQuery, setSearchQuery] = useState(saved?.searchQuery || { from: "", to: "", date: "" });
  const [searchResults, setSearchResults] = useState(saved?.searchResults || []);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(saved?.page || 1);
  const [totalPages, setTotalPages] = useState(saved?.totalPages || 1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const token = localStorage.getItem("token");
  const calculateAvailableCapacity = (trip) => trip.capacity - (trip.totalDeliveredItems || 0);
  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  // Fetch trips
  const fetchTrips = async (pageNumber = 1) => {
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await axios.get(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          fromCity: searchQuery.from.trim(),
          toCity: searchQuery.to.trim(),
          date: searchQuery.date || undefined,
          page: pageNumber,
          limit: 5
        }
      });
      const filtered = res.data.trips.filter(t => calculateAvailableCapacity(t) > 0);
      setSearchResults(filtered);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      if (filtered.length === 0) setSearchError("No trips found");
    } catch (err) {
      setSearchError("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.from.trim() || !searchQuery.to.trim()) {
      setSearchError("From and To city required");
      return;
    }
    fetchTrips(1);
  };

  // Fetch requests of this demander
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/requests/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Available Trips</h1>
        <p className="text-gray-600">Search for travelers going your way and send your items</p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Search Trips</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input 
                placeholder="From city" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={searchQuery.from} 
                onChange={e => setSearchQuery({...searchQuery, from: e.target.value})} 
              />
            </div>
            <div>
              <input 
                placeholder="To city" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={searchQuery.to} 
                onChange={e => setSearchQuery({...searchQuery, to: e.target.value})} 
              />
            </div>
            <div>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={searchQuery.date} 
                onChange={e => setSearchQuery({...searchQuery, date: e.target.value})} 
              />
            </div>
          </div>
          <button 
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            {searchLoading ? "Searching..." : "Search Trips"}
          </button>
        </form>
        {searchError && <p className="mt-3 text-red-500 text-center font-medium">{searchError}</p>}
      </div>

      {/* SEARCH RESULTS */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Available Trips</h2>
          <div className="space-y-4">
            {searchResults.map(trip => (
              <div key={trip._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-lg">🚗</span>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{trip.fromCity} → {trip.toCity}</p>
                        <p className="text-gray-600 text-sm">{formatDate(trip.departureDate)} | {trip.departureTime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg">
                      <p className="text-sm text-gray-700">Capacity: <span className="font-bold">{calculateAvailableCapacity(trip)}/{trip.capacity}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/trip/${trip._id}`, { 
                          state: { 
                            itemDemanderState: { searchQuery, searchResults, page, totalPages }
                          }
                        })} 
                        className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-200"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => navigate(`/request/${trip._id}`, { 
                          state: { 
                            itemDemanderState: { searchQuery, searchResults, page, totalPages }
                          }
                        })} 
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {searchResults.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-12">
          <button
            disabled={page === 1}
            onClick={() => fetchTrips(page - 1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>←</span> Previous
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Page</span>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold">{page}</span>
            <span className="text-gray-600">of {totalPages}</span>
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => fetchTrips(page + 1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            Next <span>→</span>
          </button>
        </div>
      )}

      {/* MY REQUESTS */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">My Delivery Requests</h2>
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-gray-500">No requests yet. Start by searching for trips above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <div key={r._id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition duration-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        r.status === "accepted" ? "bg-green-100" : 
                        r.status === "rejected" ? "bg-red-100" : "bg-yellow-100"
                      }`}>
                        <span className={`text-lg ${
                          r.status === "accepted" ? "text-green-600" : 
                          r.status === "rejected" ? "text-red-600" : "text-yellow-600"
                        }`}>
                          {r.status === "accepted" ? "✓" : r.status === "rejected" ? "✗" : "⏳"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{r.itemName} <span className="font-normal text-gray-600">({r.itemType})</span></p>
                        {r.tripId && (
                          <p className="text-sm text-gray-500">
                            {r.tripId.fromCity} → {r.tripId.toCity} | {formatDate(r.tripId.departureDate)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full font-medium ${
                      r.status === "accepted" ? "bg-green-100 text-green-700" : 
                      r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {r.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDemander;