import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!userData || !isAuthenticated) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-white/80">
                Manage your deliveries and trips from your dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-bold">⭐</span>
                </div>
                <div>
                  <p className="text-white text-sm">Your Rating</p>
                  <p className="text-white font-bold text-lg">{user?.rating || 0}.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-blue-600">📊</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-800">{user?.totalDeliveries || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-yellow-600">⏳</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl text-purple-600">💰</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Earnings</p>
                <p className="text-2xl font-bold text-gray-800">₹0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-xl">⚡</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  to="/post-trip" 
                  className="group bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors">
                      <span className="text-white text-xl">🚗</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Post a Trip</h3>
                      <p className="text-sm text-gray-600">Share your travel plans</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/post-request" 
                  className="group bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors">
                      <span className="text-white text-xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Request Delivery</h3>
                      <p className="text-sm text-gray-600">Need something delivered</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/trips" 
                  className="group bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors">
                      <span className="text-white text-xl">🔍</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Browse Trips</h3>
                      <p className="text-sm text-gray-600">Find available travelers</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/requests" 
                  className="group bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-orange-600 transition-colors">
                      <span className="text-white text-xl">📋</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">View Requests</h3>
                      <p className="text-sm text-gray-600">See delivery requests</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600">📦</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">No recent activity</p>
                    <p className="text-sm text-gray-500">Your activity will appear here</p>
                  </div>
                  <span className="text-sm text-gray-500">Just now</span>
                </div>
                
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📊</span>
                  </div>
                  <p className="text-gray-500">Start posting trips or requests to see activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Status */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="text-gray-700 font-medium">{user?.rating || 0}.0</span>
                    <span className="text-gray-500 text-sm ml-2">({user?.totalDeliveries || 0} deliveries)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600">📱</span>
                    </div>
                    <span className="text-gray-700">Phone</span>
                  </div>
                  <span className="font-medium">+91 {user?.phone}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600">👤</span>
                    </div>
                    <span className="text-gray-700">Account Type</span>
                  </div>
                  <span className="font-medium capitalize">{user?.role || 'User'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-purple-600">📅</span>
                    </div>
                    <span className="text-gray-700">Member Since</span>
                  </div>
                  <span className="font-medium">Today</span>
                </div>
              </div>
              
              <Link 
                to="/profile/edit" 
                className="block mt-6 w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
            </div>

            {/* Status Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Delivery Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Pending</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">In Transit</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Delivered</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">Cancelled</span>
                  </div>
                  <span className="font-bold">0</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link 
                  to="/my-deliveries" 
                  className="flex items-center justify-center text-primary hover:text-blue-700 font-medium"
                >
                  View All Deliveries
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Messages */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-2xl">🚗</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">No Active Trips</h3>
                <p className="text-gray-600 text-sm">You haven't posted any trips yet</p>
              </div>
            </div>
            <Link 
              to="/post-trip" 
              className="inline-flex items-center text-primary hover:text-blue-700 font-medium"
            >
              Post your first trip
              <span className="ml-2">→</span>
            </Link>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">No Active Requests</h3>
                <p className="text-gray-600 text-sm">You haven't made any delivery requests</p>
              </div>
            </div>
            <Link 
              to="/post-request" 
              className="inline-flex items-center text-primary hover:text-blue-700 font-medium"
            >
              Request your first delivery
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 PeerParcel. All rights reserved.</p>
            <p className="mt-1">Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;