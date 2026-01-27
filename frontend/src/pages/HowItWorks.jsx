import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up & Create Profile',
      description: 'Create your free account in minutes. Add basic information and verify your identity for trusted transactions.',
      icon: '👤',
      details: [
        'Email verification',
        'Phone number verification',
        'Profile completion',
        'Set preferences'
      ]
    },
    {
      number: '02',
      title: 'Post Your Need',
      description: 'Need something delivered? Post your item request with all necessary details.',
      icon: '📝',
      details: [
        'Item description',
        'Pickup & drop locations',
        'Delivery deadline',
        'Item type & size',
        'Offered price'
      ]
    },
    {
      number: '03',
      title: 'Find Travelers',
      description: 'Browse through verified travelers going your way or let the system match you automatically.',
      icon: '🔍',
      details: [
        'Search by route',
        'Filter by date',
        'View traveler ratings',
        'Check available capacity',
        'Compare prices'
      ]
    },
    {
      number: '04',
      title: 'Connect & Confirm',
      description: 'Chat with potential carriers, discuss details, and confirm the delivery arrangement.',
      icon: '💬',
      details: [
        'Secure in-app chat',
        'Share photos if needed',
        'Negotiate terms',
        'Review agreement',
        'Confirm booking'
      ]
    },
    {
      number: '05',
      title: 'Track & Deliver',
      description: 'Track your delivery in real-time and receive notifications at every stage.',
      icon: '📍',
      details: [
        'Real-time tracking',
        'Status updates',
        'Estimated arrival',
        'Photo confirmation',
        'Secure handover'
      ]
    },
    {
      number: '06',
      title: 'Rate & Pay',
      description: 'Complete the transaction securely and share feedback to help the community.',
      icon: '⭐',
      details: [
        'Secure payment release',
        'Rate your experience',
        'Leave a review',
        'Earn trust points',
        'Build reputation'
      ]
    }
  ];

  const userTypes = [
    {
      role: '📦 Item Demander',
      color: 'bg-blue-50 border-blue-200',
      steps: [
        'Post delivery request',
        'Browse available travelers',
        'Select best match',
        'Track delivery in real-time',
        'Pay upon successful delivery'
      ]
    },
    {
      role: '🚗 Carrier/Traveler',
      color: 'bg-green-50 border-green-200',
      steps: [
        'Post your travel plans',
        'Browse delivery requests',
        'Accept matching requests',
        'Pick up & deliver items',
        'Earn extra money'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How PeerParcel Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              A simple, secure, and efficient way to get items delivered using existing travel routes. 
              Follow these easy steps to start sending or receiving packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary">
                Get Started Free
              </Link>
              <Link to="/" className="btn-outline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple 6-Step Process
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                  index % 2 === 0 ? 'border-primary' : 'border-secondary'
                } hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    index % 2 === 0 ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <span className="text-3xl">{step.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        index % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                      }`}>
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className={`w-2 h-2 rounded-full mr-3 ${
                            index % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                          }`}></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Type Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            For Both Users
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className={`rounded-xl border-2 p-6 ${user.color}`}>
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-4">{user.role.split(' ')[0]}</span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {user.role.split(' ').slice(1).join(' ')}
                  </h3>
                </div>
                
                <ul className="space-y-4">
                  {user.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${
                        index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        ✓
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link 
                    to="/signup" 
                    className={`inline-block w-full text-center py-3 rounded-lg font-semibold ${
                      index === 0 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Get Started as {user.role.split(' ')[1]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'How do I ensure my items are safe?',
                a: 'We use a verification system for all users, allow photo sharing of items, provide secure messaging, and have a rating system for accountability.'
              },
              {
                q: 'What types of items can be delivered?',
                a: 'Documents, books, clothing, small electronics, gifts, and other non-hazardous items. Restricted items include cash, jewelry, illegal substances, and perishables.'
              },
              {
                q: 'How is pricing determined?',
                a: 'Pricing is set by the item demander based on item size, route, and urgency. Carriers can accept or negotiate the price.'
              },
              {
                q: 'What if my item gets damaged or lost?',
                a: 'While we encourage careful handling, we recommend users share photos before and after delivery and consider insurance for valuable items.'
              },
              {
                q: 'How do payments work?',
                a: 'Payments are held securely until delivery is confirmed. Once marked as delivered, the payment is released to the carrier.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your First Delivery?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are making delivery faster, cheaper, and more convenient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-secondary bg-white text-primary hover:bg-gray-100">
              Sign Up Free
            </Link>
            <Link to="/" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              Browse Active Trips
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
              <p className="text-gray-400">Making delivery simple and efficient</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/how-it-works" className="text-gray-300 hover:text-white">
                How It Works
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white">
                Contact
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400">
            <p>© 2024 Peer-to-Peer Delivery System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;