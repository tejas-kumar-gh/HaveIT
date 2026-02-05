import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const PostTrip = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const [form, setForm] = useState({
    fromCity: "",
    toCity: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    capacity: "",
    allowedItemTypes: [],
    pickupLocation: "",
    dropLocation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemOptions = ["Electronics", "Food", "Documents", "Clothes", "Fragile", "Books", "Medicines", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, allowedItemTypes: [...form.allowedItemTypes, value] });
    } else {
      setForm({
        ...form,
        allowedItemTypes: form.allowedItemTypes.filter((item) => item !== value),
      });
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate arrival after departure
    if (new Date(form.arrivalDate + "T" + form.arrivalTime) <= new Date(form.departureDate + "T" + form.departureTime)) {
      setError("Arrival must be after departure");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      const response = await axios.post(`${API_URL}/trips/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Post a New Trip</h1>
          <p className="text-gray-600">Share your journey and help others deliver their items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* FORM HEADER */}
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🚗</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Trip Information</h2>
                <p className="text-white/90">Fill in your journey details below</p>
              </div>
            </div>
          </div>

          {/* FORM BODY */}
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* LOCATION ROW */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</div>
                    <input
                      type="text"
                      name="fromCity"
                      value={form.fromCity}
                      onChange={handleChange}
                      required
                      placeholder="Enter departure city"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</div>
                    <input
                      type="text"
                      name="toCity"
                      value={form.toCity}
                      onChange={handleChange}
                      required
                      placeholder="Enter destination city"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* DEPARTURE ROW */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</div>
                    <input
                      type="date"
                      name="departureDate"
                      value={form.departureDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">⏰</div>
                    <input
                      type="time"
                      name="departureTime"
                      value={form.departureTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* ARRIVAL ROW */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📅</div>
                    <input
                      type="date"
                      name="arrivalDate"
                      value={form.arrivalDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">⏰</div>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={form.arrivalTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* CAPACITY & ITEM TYPES */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📦</div>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      required
                      min={1}
                      placeholder="Number of items you can carry"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</div>
                    <input
                      type="text"
                      name="pickupLocation"
                      value={form.pickupLocation}
                      onChange={handleChange}
                      placeholder="Specific pickup point"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* DROP LOCATION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</div>
                  <input
                    type="text"
                    name="dropLocation"
                    value={form.dropLocation}
                    onChange={handleChange}
                    placeholder="Specific drop point"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* ALLOWED ITEM TYPES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allowed Item Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {itemOptions.map((item) => (
                    <label
                      key={item}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                        form.allowedItemTypes.includes(item)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={item}
                        checked={form.allowedItemTypes.includes(item)}
                        onChange={handleCheckboxChange}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 border rounded flex items-center justify-center ${
                        form.allowedItemTypes.includes(item)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}>
                        {form.allowedItemTypes.includes(item) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Select the types of items you're willing to carry</p>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-500 transition duration-200 flex items-center justify-center gap-2"
                >
                  <span>←</span>
                  Go Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Posting Trip...
                    </>
                  ) : (
                    <>
                      <span>🚗</span>
                      Post Trip
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* HELPER TEXT */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            By posting a trip, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostTrip;