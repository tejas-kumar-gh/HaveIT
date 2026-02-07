import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const TripDetails = () => {
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId") || id;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchDetails = async () => {
    try {
      setLoading(true);

      // 🔹 CASE 1: opened via request
      if (searchParams.get("requestId")) {
        const res = await axios.get(
          `${API_URL}/requests/${searchParams.get("requestId")}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRequest(res.data.request);
        setTrip(res.data.request.tripId);
      }

      // 🔹 CASE 2: opened via trip id
      else if (id) {
        const res = await axios.get(
          `${API_URL}/trips/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTrip(res.data.trip);
        setRequest(null);
      }

      else {
        setTrip(null);
      }

    } catch (err) {
      console.error("Failed to load details", err);
      setTrip(null);
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [id, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Trip Not Found</h2>
          <p className="text-gray-600 mb-6">The requested trip details could not be loaded or do not exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <button
            onClick={() =>
  navigate("/item-demander", {
    state: location.state?.itemDemanderState
      ? { itemDemanderState: location.state.itemDemanderState }
      : null
  })
}

            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition duration-200"
          >
            <span className="text-xl">←</span>
            Back to Previous Page
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Trip Details</h1>
          <p className="text-gray-600">View complete information about this delivery trip</p>
        </div>

        <div className="space-y-8">
          {/* TRIP DETAILS CARD */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🚗</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Trip Information</h2>
                <p className="text-gray-600">Complete journey details</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">From City</p>
                  <p className="text-lg font-bold text-gray-800">{trip.fromCity}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">To City</p>
                  <p className="text-lg font-bold text-gray-800">{trip.toCity}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Date</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(trip.departureDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-600 mb-1">Capacity</p>
                  <p className="text-lg font-bold text-blue-700">{trip.capacity} items</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Available Space</p>
                  <p className="text-lg font-bold text-gray-800">
                    {trip.capacity - (trip.totalDeliveredItems || 0)}/{trip.capacity}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Departure Time</p>
                  <p className="text-lg font-bold text-gray-800">{trip.departureTime || "To be confirmed"}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600">📍</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800">Journey Route</h3>
              </div>
              <div className="relative">
                <div className="flex items-center justify-center">
                  <div className="text-center px-6 py-3 bg-blue-100 rounded-lg">
                    <p className="text-lg font-bold text-blue-700">
                      {trip.fromCity} → {trip.toCity}
                    </p>
                    <p className="text-blue-600">Direct Route</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REQUESTED ITEM DETAILS CARD */}
          {request && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📦</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Requested Item Details</h2>
                  <p className="text-gray-600">Information about the delivery item</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 mb-1">Item Name</p>
                    <p className="text-lg font-bold text-gray-800">{request.itemName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Item Type</p>
                    <p className="text-lg font-bold text-gray-800">{request.itemType || "General"}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 mb-1">Quantity</p>
                    <p className="text-lg font-bold text-blue-700">{request.quantity} units</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600 mb-1">Price</p>
                    <p className="text-lg font-bold text-purple-700">₹{request.price}</p>
                  </div>
                  <div className={`rounded-xl p-4 ${
                    request.status === 'accepted' ? 'bg-green-50 border border-green-200' :
                    request.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <p className="text-sm mb-1">Status</p>
                    <p className={`text-lg font-bold ${
                      request.status === 'accepted' ? 'text-green-700' :
                      request.status === 'rejected' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Request ID</p>
                    <p className="text-lg font-mono font-bold text-gray-800">{request._id?.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {request.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">Item Description</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{request.description}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">Requester Information</h3>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800 mb-1">{request.demanderId?.name || "Unknown User"}</p>
                  {request.demanderId?.email && (
                    <p className="text-blue-600">{request.demanderId.email}</p>
                  )}
                  {request.demanderId?.phone && (
                    <p className="text-gray-600 mt-1">Phone: {request.demanderId.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;