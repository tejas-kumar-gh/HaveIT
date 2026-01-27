import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      <Navbar  />
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Post Your Request</h3>
              <p className="text-gray-600">
                Need something delivered? Post your item request with details like item type, route, and deadline.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Find Travelers</h3>
              <p className="text-gray-600">
                Connect with people already traveling on your desired route. Save money and time compared to couriers.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Safe Delivery</h3>
              <p className="text-gray-600">
                Track your delivery in real-time, communicate with carriers, and ensure safe handover of items.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Peer-to-Peer Delivery?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">⚡</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Faster Delivery</h4>
                  <p className="text-gray-600">
                    Get items delivered within hours by leveraging existing travel routes instead of waiting for courier schedules.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">💰</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Cost-Effective</h4>
                  <p className="text-gray-600">
                    Save up to 60% compared to traditional courier services. Travelers earn extra money for their trips.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🌱</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Eco-Friendly</h4>
                  <p className="text-gray-600">
                    Reduce carbon footprint by utilizing existing travel instead of additional delivery vehicles.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600">🔒</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Secure & Reliable</h4>
                  <p className="text-gray-600">
                    Verified users, rating system, and secure communication ensure trustworthy transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    {/* CTA Section in HomePage.jsx */}
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-white mb-6">
      Ready to Start Delivering or Receiving?
    </h2>
    <p className="text-xl text-white/90 mb-8">
      Join our community of thousands who are making delivery faster, cheaper, and greener.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link 
        to="/signup" 
        className="btn-secondary bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold"
      >
        Get Started Free
      </Link>
      <Link 
        to="/how-it-works" 
        className="btn-outline border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold"
      >
        Learn More
      </Link>
    </div>
  </div>
</section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">PeerParcel</h3>
              <p className="text-gray-400">Connecting travelers with deliveries</p>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2024 Peer-to-Peer Delivery System. All rights reserved.</p>
              <p className="mt-2">Academic Project - Computer Science</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;