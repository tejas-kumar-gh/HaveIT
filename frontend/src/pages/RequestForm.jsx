import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const RequestForm = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    itemName: "",
    itemType: "",
    quantity: 1,
    price: "",
    description: ""
  });

  // 🔹 Fetch trip details (for display)
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrip(res.data);
      } catch (err) {
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  // 🔹 Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `${API_URL}/requests`,
        {
          tripId,
          ...form,
          phone: user.phone,
          email: user.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Request sent successfully!");

      // 🔙 Go back to Dashboard with preserved state
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚫</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Trip</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Request Delivery</h1>
          <p className="text-gray-600">Send your item delivery request to the traveler</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* TRIP INFO HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🚗</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Trip Details</h2>
                  <p className="text-white/90">Delivery route information</p>
                </div>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-white/90 text-sm">Available Capacity</p>
                <p className="text-2xl font-bold text-white">
                  {trip.capacity - (trip.totalDeliveredItems || 0)}/{trip.capacity}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/80 text-sm mb-1">Route</p>
                <p className="text-xl font-bold text-white">{trip.fromCity} → {trip.toCity}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/80 text-sm mb-1">Departure</p>
                <p className="text-lg font-bold text-white">
                  {new Date(trip.departureDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })} | {trip.departureTime}
                </p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📦</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Item Details</h3>
                <p className="text-gray-600">Provide information about your item</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ITEM NAME & TYPE */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📦</div>
                    <input
                      placeholder="e.g., Laptop, Documents, Gift"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                      value={form.itemName}
                      onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🏷️</div>
                    <input
                      placeholder="e.g., Electronics, Documents, Clothes"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                      value={form.itemType}
                      onChange={(e) => setForm({ ...form, itemType: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* QUANTITY & PRICE */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔢</div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Number of items"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">💰</div>
                    <input
                      type="number"
                      placeholder="Amount you're willing to pay"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Description
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-4 text-gray-400">📝</div>
                  <textarea
                    placeholder="Provide additional details about your item (size, weight, special instructions)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 h-32"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Optional: Help the carrier understand your delivery needs better</p>
              </div>

              {/* TERMS */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">ℹ️</span>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">
                      By submitting this request, you agree to our terms of service. The carrier will review your request and respond within 24 hours. You will be notified via email about the status of your request.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 px-6 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-500 transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>←</span>
                  Cancel Request
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <span>📨</span>
                      Send Delivery Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* HELPER INFO */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Tips for a Successful Request</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Be specific about your item details</li>
                <li>• Offer a fair price based on item size and distance</li>
                <li>• Include special instructions if needed</li>
                <li>• Provide accurate contact information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;