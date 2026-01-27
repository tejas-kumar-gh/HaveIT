import React from 'react';
import { Link } from 'react-router-dom'; // link as <a> tag

const HeroSection = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Deliver & Receive Items
              <span className="block text-primary">With Travelers</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Connect with people already traveling on your route. Get important documents, 
              personal items, or essentials delivered faster and cheaper than traditional couriers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/signup" className="btn-primary text-center">
                Start Delivering
              </Link>
              <Link to="/how-it-works" className="btn-outline text-center">
                How It Works
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5000+</div>
                <div className="text-gray-600">Successful Deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">1200+</div>
                <div className="text-gray-600">Active Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">60%</div>
                <div className="text-gray-600">Cost Savings</div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Illustration/Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl p-8 shadow-2xl">
              <div className="relative h-64 md:h-80">
                {/* Placeholder for illustration - Replace with actual image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚗📦</div>
                    <p className="text-gray-700 font-medium">
                      Connect travelers with deliveries
                    </p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary">📦</span>
                    </div>
                    <span className="font-medium">Post Request</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                      <span className="text-secondary">✅</span>
                    </div>
                    <span className="font-medium">Get Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;