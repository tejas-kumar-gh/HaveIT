import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const PostTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    capacity: 1,
    allowedItemTypes: [],
    pickupLocation: '',
    dropLocation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const itemTypes = ['documents', 'clothes', 'electronics', 'books', 'food', 'others'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromCity.trim()) newErrors.fromCity = 'From city is required';
    if (!formData.toCity.trim()) newErrors.toCity = 'To city is required';
    if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
    if (!formData.arrivalTime) newErrors.arrivalTime = 'Arrival time is required';
    if (formData.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (formData.allowedItemTypes.length === 0) newErrors.allowedItemTypes = 'Select at least one item type';

    // Validate date logic
    const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}`);
    const arrivalDateTime = new Date(`${formData.arrivalDate}T${formData.arrivalTime}`);
    
    if (arrivalDateTime <= departureDateTime) {
      newErrors.arrivalDate = 'Arrival must be after departure';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle item type checkboxes
      const updatedTypes = checked
        ? [...formData.allowedItemTypes, name]
        : formData.allowedItemTypes.filter(type => type !== name);
      setFormData({ ...formData, allowedItemTypes: updatedTypes });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data according to your schema
      const tripData = {
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        arrivalDate: formData.arrivalDate,
        arrivalTime: formData.arrivalTime,
        capacity: parseInt(formData.capacity),
        allowedItemTypes: formData.allowedItemTypes,
        pickupLocation: formData.pickupLocation || '',
        dropLocation: formData.dropLocation || '',
      };

      console.log('Sending trip data:', tripData);

      const response = await axios.post(`${API_URL}/trips`, tripData, {
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccessMessage('Trip posted successfully! Redirecting to trips page...');
        setTimeout(() => {
          navigate('/my-trips');
        }, 2000);
      }
    } catch (error) {
      console.error('Post trip error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        const fieldErrors = {};
        Object.keys(backendErrors).forEach(key => {
          fieldErrors[key] = backendErrors[key].message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Failed to post trip. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-primary hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Post a New Trip</h1>
          <p className="text-gray-600">Share your travel plans and earn money</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <div className="flex items-center">
              <span className="text-lg mr-2">✅</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <div className="flex items-center">
              <span className="text-lg mr-2">❌</span>
              <span>{errors.general}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From City */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                From City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fromCity"
                value={formData.fromCity}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.fromCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Delhi"
              />
              {errors.fromCity && (
                <p className="text-red-500 text-sm mt-1">{errors.fromCity}</p>
              )}
            </div>

            {/* To City */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                To City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="toCity"
                value={formData.toCity}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.toCity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Mumbai"
              />
              {errors.toCity && (
                <p className="text-red-500 text-sm mt-1">{errors.toCity}</p>
              )}
            </div>

            {/* Departure Date */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Departure Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.departureDate ? 'border-red-500' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.departureDate && (
                <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>
              )}
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Departure Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.departureTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.departureTime && (
                <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>
              )}
            </div>

            {/* Arrival Date */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Arrival Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.arrivalDate ? 'border-red-500' : 'border-gray-300'
                }`}
                min={formData.departureDate || new Date().toISOString().split('T')[0]}
              />
              {errors.arrivalDate && (
                <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>
              )}
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Arrival Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.arrivalTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.arrivalTime && (
                <p className="text-red-500 text-sm mt-1">{errors.arrivalTime}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Capacity (Number of Items) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">Maximum number of items you can carry</p>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Pickup Location (Optional)
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g., Connaught Place, Delhi"
            />
            <p className="text-gray-500 text-sm mt-1">Where will you pick up items?</p>
          </div>

          {/* Drop Location */}
          <div className="mt-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Drop Location (Optional)
            </label>
            <input
              type="text"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g., Bandra West, Mumbai"
            />
            <p className="text-gray-500 text-sm mt-1">Where will you drop items?</p>
          </div>

          {/* Allowed Item Types */}
          <div className="mt-8">
            <label className="block text-gray-700 mb-3 font-medium">
              Allowed Item Types <span className="text-red-500">*</span>
            </label>
            {errors.allowedItemTypes && (
              <p className="text-red-500 text-sm mb-3">{errors.allowedItemTypes}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {itemTypes.map(type => (
                <label 
                  key={type} 
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    formData.allowedItemTypes.includes(type) 
                      ? 'border-primary bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={type}
                    checked={formData.allowedItemTypes.includes(type)}
                    onChange={handleChange}
                    className="mr-3 h-5 w-5"
                  />
                  <span className="capitalize font-medium">{type}</span>
                </label>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">Select the types of items you're willing to carry</p>
          </div>

          {/* Submit Button */}
          <div className="mt-10 pt-6 border-t">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Posting Trip...
                  </>
                ) : (
                  '🚗 Post Trip'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            
            <p className="text-gray-500 text-sm text-center mt-4">
              After posting, your trip will be visible to item demanders searching for your route
            </p>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="font-bold text-blue-800 mb-3">💡 Tips for a successful trip post:</h3>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Be specific about pickup and drop locations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Select the types of items you're comfortable carrying</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Set realistic capacity based on your vehicle space</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Accurate dates and times help demanders plan better</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostTrip;